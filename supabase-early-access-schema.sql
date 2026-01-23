-- Early Access System Database Schema
-- Run this in your Supabase SQL Editor

-- 1. Access Requests Table (people requesting early access)
CREATE TABLE IF NOT EXISTS access_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES auth.users(id)
);

-- 2. Invite Codes Table (codes you generate for early access)
CREATE TABLE IF NOT EXISTS invite_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  description TEXT, -- e.g., "Cold Email Campaign Jan 2026"
  max_uses INTEGER DEFAULT 1, -- how many times this code can be used
  uses_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id)
);

-- 3. Code Redemptions Table (track who used which code)
CREATE TABLE IF NOT EXISTS code_redemptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invite_code_id UUID REFERENCES invite_codes(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  email TEXT NOT NULL,
  redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address TEXT
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_access_requests_email ON access_requests(email);
CREATE INDEX IF NOT EXISTS idx_access_requests_status ON access_requests(status);
CREATE INDEX IF NOT EXISTS idx_invite_codes_code ON invite_codes(code);
CREATE INDEX IF NOT EXISTS idx_invite_codes_active ON invite_codes(is_active);
CREATE INDEX IF NOT EXISTS idx_code_redemptions_code ON code_redemptions(code);
CREATE INDEX IF NOT EXISTS idx_code_redemptions_user ON code_redemptions(user_id);

-- Enable Row Level Security
ALTER TABLE access_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE invite_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE code_redemptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for access_requests
-- Anyone can insert (request access)
CREATE POLICY "Anyone can request access"
  ON access_requests FOR INSERT
  TO public
  WITH CHECK (true);

-- Only authenticated users can view their own requests
CREATE POLICY "Users can view their own requests"
  ON access_requests FOR SELECT
  TO authenticated
  USING (email = auth.jwt()->>'email');

-- RLS Policies for invite_codes
-- Anyone can check if a code exists and is valid (for verification)
CREATE POLICY "Anyone can verify codes"
  ON invite_codes FOR SELECT
  TO public
  USING (is_active = true AND (expires_at IS NULL OR expires_at > NOW()));

-- RLS Policies for code_redemptions
-- Anyone can insert redemptions (when using a code)
CREATE POLICY "Anyone can redeem codes"
  ON code_redemptions FOR INSERT
  TO public
  WITH CHECK (true);

-- Users can view their own redemptions
CREATE POLICY "Users can view own redemptions"
  ON code_redemptions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR email = auth.jwt()->>'email');

-- Function to increment code usage
CREATE OR REPLACE FUNCTION increment_code_usage()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE invite_codes
  SET uses_count = uses_count + 1
  WHERE id = NEW.invite_code_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-increment code usage
CREATE TRIGGER on_code_redemption
  AFTER INSERT ON code_redemptions
  FOR EACH ROW
  EXECUTE FUNCTION increment_code_usage();

-- Insert a test code for initial testing
INSERT INTO invite_codes (code, description, max_uses) VALUES
  ('TEST2026XY', 'Test Code', 1)
ON CONFLICT (code) DO NOTHING;

-- View to check code validity (useful for queries)
CREATE OR REPLACE VIEW valid_codes AS
SELECT
  code,
  description,
  max_uses,
  uses_count,
  (max_uses - uses_count) as remaining_uses,
  expires_at
FROM invite_codes
WHERE is_active = true
  AND uses_count < max_uses
  AND (expires_at IS NULL OR expires_at > NOW());
