# Database Setup for Electrium Store

This document explains how to set up the database schema for the Electrium Store application.

## Prerequisites

1. A Supabase project with the following environment variables configured:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Database Schema Setup

### 1. Create the Profiles Table

Run the following SQL commands in your Supabase SQL Editor:

```sql
-- Create profiles table to store user profile information
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  address TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view and update their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create function to handle profile updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update the updated_at column
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### 2. Verify the Setup

After running the SQL commands:

1. Go to your Supabase Dashboard
2. Navigate to the "Table Editor"
3. You should see a new `profiles` table
4. Check that Row Level Security (RLS) is enabled
5. Verify that the policies are created

### 3. Test the Integration

1. Start your Next.js development server: `npm run dev`
2. Navigate to `/signup` and create a new user account
3. After email verification, log in and go to `/dashboard/profile`
4. You should see your profile information populated from the database
5. Try updating your profile information and save changes

## Features Implemented

### Profile Management

- **Automatic Profile Creation**: When a user signs up, a profile record is automatically created
- **Profile Display**: The dashboard profile page shows actual user data from the database
- **Profile Updates**: Users can update their profile information (first name, last name, email, phone, address)
- **Security**: Row Level Security ensures users can only access their own profile data

### Dashboard Integration

- **Dynamic User Names**: The dashboard welcome message shows the user's actual name from their profile
- **Fallback Logic**: If profile data is not available, falls back to user metadata or email

## Database Schema Details

### Profiles Table

- `id`: UUID (Primary Key, references auth.users.id)
- `first_name`: TEXT - User's first name
- `last_name`: TEXT - User's last name
- `phone`: TEXT - User's phone number
- `address`: TEXT - User's address
- `avatar_url`: TEXT - URL to user's profile picture
- `created_at`: TIMESTAMP - When the profile was created
- `updated_at`: TIMESTAMP - When the profile was last updated

### Security Features

- **Row Level Security (RLS)**: Enabled on the profiles table
- **Policies**: Users can only view, update, and insert their own profile data
- **Automatic Triggers**: Profile creation and timestamp updates are handled automatically

## Troubleshooting

### Common Issues

1. **Profile not created on signup**: Check that the trigger function is properly created and the auth.users table has the correct structure.

2. **Permission denied errors**: Ensure RLS policies are correctly configured and the user is authenticated.

3. **Profile data not loading**: Verify that the user has a corresponding record in the profiles table.

### Debugging

1. Check the Supabase logs in the dashboard for any SQL errors
2. Verify that the environment variables are correctly set
3. Test the database connection using the Supabase client in the browser console

## Next Steps

With the profiles table set up, you can now:

1. Add more profile fields as needed (e.g., date of birth, preferences)
2. Implement profile picture upload functionality
3. Add profile validation and sanitization
4. Create admin interfaces to manage user profiles
5. Implement profile completion workflows
