-- Database Schema for Tasks Feature
-- This adds task management with claim functionality

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  task_id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'assigned', 'done')),
  claimed_by UUID REFERENCES customers(id) ON DELETE SET NULL,
  claimed_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES customers(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for tasks table
-- All authenticated users can view all tasks
CREATE POLICY "Authenticated users can view all tasks" ON tasks
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Authenticated users can insert tasks
CREATE POLICY "Authenticated users can insert tasks" ON tasks
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update tasks (for claiming and status changes)
CREATE POLICY "Authenticated users can update tasks" ON tasks
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_tasks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS tasks_updated_at ON tasks;
CREATE TRIGGER tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_tasks_updated_at();

-- Insert sample tasks for testing
INSERT INTO tasks (title, description, status) VALUES
('Fix homepage hero section', 'Update the hero section with new branding images and improve responsive design', 'todo'),
('Add product filtering', 'Implement filter functionality for bikes by price, type, and availability', 'todo'),
('Update checkout flow', 'Improve the checkout process with better error handling and validation', 'todo'),
('Write API documentation', 'Document all API endpoints for the development team', 'todo'),
('Optimize image loading', 'Implement lazy loading and image optimization for better performance', 'todo');
