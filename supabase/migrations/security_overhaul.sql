/*
  =============================================================================
  SECURITY OVERHAUL MIGRATION
  -----------------------------------------------------------------------------
  Focus: ID Spoofing, Price Manipulation, Unauthorized Deletion, Service-Role Leakage
  Author: Senior Security Architect
  =============================================================================
*/

-- 1. Create Orders and Order Items Tables (if not exist)
CREATE TABLE IF NOT EXISTS public.orders (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    total_amount NUMERIC(10, 2) DEFAULT 0.00,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.order_items (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price_at_time NUMERIC(10, 2) NOT NULL, -- This will be verified/set by trigger
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Sensitive Data Table (Service-Role Only)
CREATE TABLE IF NOT EXISTS public.internal_profit_margins (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id uuid REFERENCES public.products(id) ON DELETE CASCADE UNIQUE,
    cost_price NUMERIC(10, 2) NOT NULL,
    profit_margin_percent NUMERIC(5, 2) NOT NULL
);

-- 3. Audit Log Table (Service-Role Only)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    table_name TEXT NOT NULL,
    record_id uuid,
    action TEXT NOT NULL,
    old_data JSONB,
    new_data JSONB,
    changed_by uuid REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internal_profit_margins ENABLE ROW LEVEL SECURITY;

-- 5. Robust RLS Policies

-- Profiles: Only own profile, no delete allowed
DROP POLICY IF EXISTS "Users can select own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can select own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Orders: Users can INSERT and SELECT their own, no UPDATE/DELETE
DROP POLICY IF EXISTS "Users can select own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can insert own orders" ON public.orders;
CREATE POLICY "Users can select own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Order Items: Linked to the user's order visibility
DROP POLICY IF EXISTS "Users can select own order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can insert own order items" ON public.order_items;
CREATE POLICY "Users can select own order items" ON public.order_items FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.orders WHERE id = order_items.order_id AND user_id = auth.uid()));

CREATE POLICY "Users can insert own order items" ON public.order_items FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM public.orders WHERE id = order_items.order_id AND user_id = auth.uid()));

-- Service-Role Only Tables: Enable RLS but add NO policies for public/authenticated
-- This ensures they are only accessible via the 'service_role' key which bypasses RLS

-- 6. Server-Side Price Protection Logic

-- Function to handle price verification and total calculation
CREATE OR REPLACE FUNCTION public.handle_order_item_security()
RETURNS TRIGGER AS $$
DECLARE
    real_price NUMERIC;
BEGIN
    -- 1. Pull the read-only price from products table (Prevent client-side tampering)
    SELECT price INTO real_price FROM public.products WHERE id = NEW.product_id;
    
    IF real_price IS NULL THEN
        RAISE EXCEPTION 'Product not found';
    END IF;

    -- 2. Force the price_at_time to be the real price
    NEW.price_at_time := real_price;

    -- 3. Update the parent order amount
    UPDATE public.orders 
    SET total_amount = total_amount + (NEW.price_at_time * NEW.quantity)
    WHERE id = NEW.order_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute before insert on order_items
DROP TRIGGER IF EXISTS tr_order_item_price_protection ON public.order_items;
CREATE TRIGGER tr_order_item_price_protection
BEFORE INSERT ON public.order_items
FOR EACH ROW EXECUTE FUNCTION public.handle_order_item_security();

-- 7. Audit Log Trigger (Track Inventory Changes)
CREATE OR REPLACE FUNCTION public.audit_inventory_changes()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.audit_logs (table_name, record_id, action, old_data, new_data, changed_by)
    VALUES (
        'products',
        CASE WHEN TG_OP = 'DELETE' THEN OLD.id ELSE NEW.id END,
        TG_OP,
        CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN to_jsonb(OLD) ELSE NULL END,
        CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END,
        auth.uid()
    );
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_audit_products ON public.products;
CREATE TRIGGER tr_audit_products
AFTER INSERT OR UPDATE OR DELETE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.audit_inventory_changes();

-- 8. Prevent Deletions on Orders/Profiles (By omitting DELETE policies)
-- The lack of a DELETE policy combined with "ALTER ... ENABLE RLS" 
-- means DELETE operations will fail for all non-admin users.

COMMIT;
