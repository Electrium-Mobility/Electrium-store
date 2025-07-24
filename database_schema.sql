-- Database Schema for Electrium Store

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bikes table
CREATE TABLE IF NOT EXISTS bikes (
  bike_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image TEXT,
  amount_stocked INTEGER DEFAULT 0,
  rental_rate DECIMAL(10,2),
  sell_price DECIMAL(10,2),
  damage_rate DECIMAL(10,2),
  for_rent BOOLEAN DEFAULT true
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  order_id SERIAL PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  shipping_address JSONB,
  payment_id TEXT,
  order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_complete BOOLEAN DEFAULT false
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  item_id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(order_id) ON DELETE CASCADE,
  bike_id INTEGER REFERENCES bikes(bike_id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  order_type TEXT NOT NULL -- 'rent' or 'sell'
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  payment_id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(order_id) ON DELETE CASCADE,
  payment_amount DECIMAL(10,2) NOT NULL,
  payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  payment_method TEXT,
  status TEXT DEFAULT 'completed'
);

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create policies for customers table
CREATE POLICY "Users can view own customer data" ON customers
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own customer data" ON customers
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own customer data" ON customers
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policies for orders table
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Users can insert own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

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

-- Create policies for payments table
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.order_id = payments.order_id 
      AND orders.customer_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own payments" ON payments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.order_id = payments.order_id 
      AND orders.customer_id = auth.uid()
    )
  );

-- Create function to handle customer creation on user signup
CREATE OR REPLACE FUNCTION handle_new_customer()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO customers (id, first_name, last_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create customer on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_customer();

-- Insert sample bike data
INSERT INTO bikes (name, description, image, amount_stocked, rental_rate, sell_price, damage_rate, for_rent) VALUES
('Electric Mountain Bike', 'High-performance electric mountain bike with advanced suspension', '/img/bike-display.png', 10, 50.00, 1200.00, 25.00, true),
('Electric City Bike', 'Comfortable electric bike perfect for urban commuting', '/img/bike-graphic.svg', 15, 35.00, 800.00, 20.00, true),
('Electric Road Bike', 'Lightweight electric road bike for speed enthusiasts', '/img/bike-display.png', 8, 45.00, 1500.00, 30.00, true)
ON CONFLICT (bike_id) DO NOTHING; 