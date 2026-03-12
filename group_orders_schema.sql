-- More robust Database Schema for Group Carts

-- Drop existing tables and functions if they exist, to ensure a clean slate.
DROP FUNCTION IF EXISTS get_group_cart_items(uuid);
DROP FUNCTION IF EXISTS remove_from_group_cart(uuid);
DROP FUNCTION IF EXISTS add_to_group_cart(uuid, integer, integer);
DROP FUNCTION IF EXISTS join_group_order(text);
DROP FUNCTION IF EXISTS create_group_order();
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS cart;
DROP TABLE IF EXISTS group_order_participants;
DROP TABLE IF EXISTS group_orders;

-- A table to store group carts
CREATE TABLE IF NOT EXISTS group_carts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    shareable_link TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- A table to link users to group carts
CREATE TABLE IF NOT EXISTS group_cart_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    group_cart_id UUID REFERENCES group_carts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    UNIQUE(group_cart_id, user_id) -- a user can only be in a group cart once
);

-- A table for items in a group cart
CREATE TABLE IF NOT EXISTS group_cart_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    group_cart_id UUID REFERENCES group_carts(id) ON DELETE CASCADE NOT NULL,
    product_id INTEGER REFERENCES bikes(bike_id) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL, -- who added the item
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE group_carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_cart_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_cart_items ENABLE ROW LEVEL SECURITY;

-- Policies for group_carts
CREATE POLICY "Users can create group carts" ON group_carts
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Members can view their group cart" ON group_carts
    FOR SELECT USING (
        id IN (
            SELECT group_cart_id FROM group_cart_members WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Owners can update their group cart" ON group_carts
    FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their group cart" ON group_carts
    FOR DELETE USING (auth.uid() = owner_id);


-- Policies for group_cart_members
CREATE POLICY "Members can see other members of their group cart" ON group_cart_members
    FOR SELECT USING (
        group_cart_id IN (
            SELECT group_cart_id FROM group_cart_members WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Owners can add members to their group cart" ON group_cart_members
    FOR INSERT WITH CHECK (
        group_cart_id IN (
            SELECT id FROM group_carts WHERE owner_id = auth.uid()
        )
    );

CREATE POLICY "Owners can remove members from their group cart" ON group_cart_members
    FOR DELETE USING (
        group_cart_id IN (
            SELECT id FROM group_carts WHERE owner_id = auth.uid()
        )
    );

CREATE POLICY "Members can leave a group cart" ON group_cart_members
    FOR DELETE USING (user_id = auth.uid());


-- Policies for group_cart_items
CREATE POLICY "Members can view the items in their group cart" ON group_cart_items
    FOR SELECT USING (
        group_cart_id IN (
            SELECT group_cart_id FROM group_cart_members WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Members can add items to their group cart" ON group_cart_items
    FOR INSERT WITH CHECK (
        user_id = auth.uid() AND
        group_cart_id IN (
            SELECT group_cart_id FROM group_cart_members WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update the quantity of their own items" ON group_cart_items
    FOR UPDATE USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());


CREATE POLICY "Users can remove their own items from the cart" ON group_cart_items
    FOR DELETE USING (user_id = auth.uid());


-- Schema for Personal Carts

CREATE TABLE IF NOT EXISTS personal_carts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS personal_cart_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    cart_id UUID REFERENCES personal_carts(id) ON DELETE CASCADE NOT NULL,
    product_id INTEGER REFERENCES bikes(bike_id) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for personal cart tables
ALTER TABLE personal_carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_cart_items ENABLE ROW LEVEL SECURITY;

-- Policies for personal_carts
CREATE POLICY "Users can view their own personal cart" ON personal_carts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own personal cart" ON personal_carts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies for personal_cart_items
CREATE POLICY "Users can view items in their own personal cart" ON personal_cart_items
    FOR SELECT USING (
        cart_id IN (
            SELECT id FROM personal_carts WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can add items to their own personal cart" ON personal_cart_items
    FOR INSERT WITH CHECK (
        cart_id IN (
            SELECT id FROM personal_carts WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update items in their own personal cart" ON personal_cart_items
    FOR UPDATE USING (
        cart_id IN (
            SELECT id FROM personal_carts WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete items from their own personal cart" ON personal_cart_items
    FOR DELETE USING (
        cart_id IN (
            SELECT id FROM personal_carts WHERE user_id = auth.uid()
        )
    );
    

-- RPC Functions

CREATE OR REPLACE FUNCTION create_group_cart(name TEXT)
RETURNS json AS $$
DECLARE
    new_group_cart_id UUID;
    shareable_link TEXT;
BEGIN
    shareable_link := substr(md5(random()::text), 0, 10);
    INSERT INTO group_carts (name, owner_id, shareable_link)
    VALUES (name, auth.uid(), shareable_link)
    RETURNING id INTO new_group_cart_id;

    INSERT INTO group_cart_members (group_cart_id, user_id)
    VALUES (new_group_cart_id, auth.uid());

    RETURN json_build_object('group_cart_id', new_group_cart_id, 'shareable_link', shareable_link);
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION join_group_cart(shareable_link_param TEXT)
RETURNS void AS $$
DECLARE
    group_cart_id_to_join UUID;
BEGIN
    SELECT id INTO group_cart_id_to_join
    FROM group_carts
    WHERE shareable_link = shareable_link_param;

    IF group_cart_id_to_join IS NULL THEN
        RAISE EXCEPTION 'Group cart not found';
    END IF;

    INSERT INTO group_cart_members (group_cart_id, user_id)
    VALUES (group_cart_id_to_join, auth.uid());
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_group_cart(p_group_cart_id UUID)
RETURNS json AS $$
DECLARE
    cart_details json;
    members json;
    items json;
BEGIN
    SELECT to_json(c) INTO cart_details
    FROM (
        SELECT id, name, owner_id, shareable_link, created_at
        FROM group_carts
        WHERE id = p_group_cart_id
    ) c;

    SELECT json_agg(m) INTO members
    FROM (
        SELECT u.id, u.email
        FROM group_cart_members gm
        JOIN auth.users u ON gm.user_id = u.id
        WHERE gm.group_cart_id = p_group_cart_id
    ) m;

    SELECT json_agg(i) INTO items
    FROM (
        SELECT
            gci.id,
            gci.product_id,
            gci.quantity,
            gci.user_id,
            u.email as user_email,
            b.name as product_name,
            b.image as product_image,
            b.sell_price as product_price
        FROM group_cart_items gci
        JOIN auth.users u ON gci.user_id = u.id
        JOIN bikes b ON gci.product_id = b.bike_id
        WHERE gci.group_cart_id = p_group_cart_id
    ) i;

    RETURN json_build_object(
        'details', cart_details,
        'members', members,
        'items', items
    );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_user_group_carts()
RETURNS json AS $$
BEGIN
    RETURN (
        SELECT json_agg(gc)
        FROM (
            SELECT g.id, g.name, g.owner_id, g.shareable_link, g.created_at
            FROM group_carts g
            JOIN group_cart_members gm ON g.id = gm.group_cart_id
            WHERE gm.user_id = auth.uid()
        ) gc
    );
END;
$$ LANGUAGE plpgsql;
