-- Database Schema for Group Orders

-- Create group_orders table
CREATE TABLE IF NOT EXISTS group_orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  shareable_link TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create group_order_participants table
CREATE TABLE IF NOT EXISTS group_order_participants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  group_order_id UUID REFERENCES group_orders(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create cart table
CREATE TABLE IF NOT EXISTS cart (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  group_order_id UUID REFERENCES group_orders(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  cart_id UUID REFERENCES cart(id) ON DELETE CASCADE,
  bike_id INTEGER REFERENCES bikes(bike_id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE group_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_order_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Create policies for group_orders table
CREATE POLICY "Users can view group orders they are a part of" ON group_orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM group_order_participants
      WHERE group_order_participants.group_order_id = group_orders.id
      AND group_order_participants.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create group orders" ON group_orders
  FOR INSERT WITH CHECK (true);

-- Create policies for group_order_participants table
CREATE POLICY "Users can view participants of group orders they are a part of" ON group_order_participants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM group_order_participants AS gop
      WHERE gop.group_order_id = group_order_participants.group_order_id
      AND gop.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can join group orders" ON group_order_participants
  FOR INSERT WITH CHECK (true);

-- Create policies for cart table
CREATE POLICY "Users can view their own cart" ON cart
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own cart" ON cart
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policies for cart_items table
CREATE POLICY "Users can view items in their own cart" ON cart_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM cart
      WHERE cart.id = cart_items.cart_id
      AND cart.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can add items to their own cart" ON cart_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM cart
      WHERE cart.id = cart_items.cart_id
      AND cart.user_id = auth.uid()
    )
  );

-- RPC Functions

CREATE OR REPLACE FUNCTION create_group_order()
RETURNS json AS $$
DECLARE
  new_group_order_id UUID;
  shareable_link TEXT;
BEGIN
  shareable_link := substr(md5(random()::text), 0, 10);
  INSERT INTO group_orders (shareable_link)
  VALUES (shareable_link)
  RETURNING id INTO new_group_order_id;

  INSERT INTO group_order_participants (group_order_id, user_id)
  VALUES (new_group_order_id, auth.uid());

  RETURN json_build_object('group_order_id', new_group_order_id, 'shareable_link', shareable_link);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION join_group_order(shareable_link_param TEXT)
RETURNS void AS $$
DECLARE
  group_order_id_to_join UUID;
BEGIN
  SELECT id INTO group_order_id_to_join
  FROM group_orders
  WHERE shareable_link = shareable_link_param;

  IF group_order_id_to_join IS NULL THEN
    RAISE EXCEPTION 'Group order not found';
  END IF;

  INSERT INTO group_order_participants (group_order_id, user_id)
  VALUES (group_order_id_to_join, auth.uid());
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION add_to_group_cart(group_order_id_param UUID, bike_id_param INTEGER, quantity_param INTEGER)
RETURNS void AS $$
DECLARE
  cart_id_to_use UUID;
  unit_price_to_use DECIMAL(10,2);
BEGIN
  SELECT id INTO cart_id_to_use
  FROM cart
  WHERE group_order_id = group_order_id_param;

  IF cart_id_to_use IS NULL THEN
    INSERT INTO cart (group_order_id, user_id)
    VALUES (group_order_id_param, auth.uid())
    RETURNING id INTO cart_id_to_use;
  END IF;

  SELECT sell_price INTO unit_price_to_use
  FROM bikes
  WHERE bike_id = bike_id_param;

  INSERT INTO cart_items (cart_id, bike_id, quantity, unit_price)
  VALUES (cart_id_to_use, bike_id_param, quantity_param, unit_price_to_use);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION remove_from_group_cart(cart_item_id_param UUID)
RETURNS void AS $$
BEGIN
  DELETE FROM cart_items
  WHERE id = cart_item_id_param;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_group_cart_items(group_order_id_param UUID)
RETURNS json AS $$
BEGIN
  RETURN (
    SELECT json_agg(
      json_build_object(
        'id', ci.id,
        'bike_id', ci.bike_id,
        'quantity', ci.quantity,
        'unit_price', ci.unit_price,
        'name', b.name,
        'image', b.image
      )
    )
    FROM cart_items ci
    JOIN bikes b ON ci.bike_id = b.bike_id
    WHERE ci.cart_id = (
      SELECT id
      FROM cart
      WHERE group_order_id = group_order_id_param
    )
  );
END;
$$ LANGUAGE plpgsql;
