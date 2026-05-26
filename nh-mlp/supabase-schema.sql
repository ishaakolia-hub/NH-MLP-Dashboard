-- ============================================================
-- NH MLP Dashboard — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================


-- 1. PROFILES TABLE
--    Extends auth.users with role information.
--    Every user gets a row here automatically on signup (see trigger below).

CREATE TABLE IF NOT EXISTS public.profiles (
  id      UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email   TEXT        NOT NULL,
  role    TEXT        NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- 2. ROW LEVEL SECURITY
--    Users can only read their own profile.
--    This prevents viewers from querying other users' roles.

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);


-- 3. AUTO-CREATE PROFILE ON SIGNUP
--    When a new user signs up via Supabase Auth, this trigger
--    automatically inserts a 'viewer' row into profiles.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'viewer')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();


-- ============================================================
-- AFTER RUNNING THE ABOVE:
--
-- 4. PROMOTE YOURSELF TO ADMIN
--    Sign up first through the app, then run this query
--    (replace with your actual email):
--
--    UPDATE public.profiles
--    SET role = 'admin'
--    WHERE email = 'ishaakolia@gmail.com';
--
-- ============================================================
