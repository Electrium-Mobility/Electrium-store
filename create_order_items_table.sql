-- Create order_items table for Electrium Store
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS order_items (
  item_id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(order_id) ON DELETE CASCADE,
  bike_id INTEGER REFERENCES bikes(bike_id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  order_type TEXT NOT NULL -- 'rent' or 'sell'
);

-- Enable Row Level Security
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create policies for order_items table
CREATE POLICY "Users can view own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.order_id = order_items.order_id 
      AND orders.customer_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own order items" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.order_id = order_items.order_id 
      AND orders.customer_id = auth.uid()
    )
  ); 