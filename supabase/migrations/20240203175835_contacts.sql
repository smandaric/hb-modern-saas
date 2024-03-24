CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE public.contacts(
    id uuid UNIQUE DEFAULT uuid_generate_v4(),
    email text,
    name text,
    company text,
    phone text,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own contacts" ON contacts
    FOR SELECT TO authenticated
        USING (auth.uid() = user_id);

CREATE POLICY "Users can update own contacts" ON contacts
    FOR UPDATE TO authenticated
        USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own contacts" ON contacts
    FOR DELETE TO authenticated
        USING (auth.uid() = user_id);
