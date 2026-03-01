-- public.user_cart_items definition
DROP TABLE IF EXISTS public.user_cart_items;
CREATE TABLE public.user_cart_items (
    user_id uuid NOT NULL,
    product_id integer NOT NULL,
    quantity integer NOT NULL DEFAULT 1,
    added_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT user_cart_items_pkey PRIMARY KEY (user_id, product_id),
    CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);
ALTER TABLE public.user_cart_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow individual read access" ON public.user_cart_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow individual create access" ON public.user_cart_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow individual update access" ON public.user_cart_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow individual delete access" ON public.user_cart_items FOR DELETE USING (auth.uid() = user_id);
