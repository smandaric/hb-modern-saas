CREATE TABLE public.billing_customers(
    id text PRIMARY KEY,
    user_id uuid UNIQUE REFERENCES auth.users(id) NOT NULL,
    email text NOT NULL,
    metadata jsonb
);

ALTER TABLE public.billing_customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own customer data" ON billing_customers
    FOR SELECT TO authenticated
        USING (auth.uid() = user_id);

CREATE TABLE public.billing_products(
    id text PRIMARY KEY,
    name text NOT NULL,
    description text NOT NULL,
    active boolean NOT NULL,
    metadata jsonb
);

ALTER TABLE public.billing_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access to products" ON billing_products
    FOR SELECT
        USING (TRUE);

CREATE TYPE subscription_status AS enum(
    'trialing',
    'active',
    'canceled',
    'incomplete',
    'incomplete_expired',
    'past_due',
    'unpaid',
    'paused'
);

CREATE TABLE public.billing_subscriptions(
    id text PRIMARY KEY,
    customer_id text REFERENCES billing_customers(id) NOT NULL,
    status subscription_status NOT NULL,
    product_id text REFERENCES billing_products(id) NOT NULL,
    user_id uuid REFERENCES auth.users(id) NOT NULL,
    cancel_at_period_end boolean,
    created timestamp with time zone NOT NULL,
    current_period_start timestamp with time zone NOT NULL,
    current_period_end timestamp with time zone NOT NULL,
    trial_start timestamp with time zone,
    trial_end timestamp with time zone,
    metadata jsonb
);

ALTER TABLE billing_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Can read own subscription data" ON billing_subscriptions
    FOR SELECT TO authenticated
        USING (auth.uid() = user_id);

