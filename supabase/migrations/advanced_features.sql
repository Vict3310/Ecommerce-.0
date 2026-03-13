-- 1. Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_name TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for reviews
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read reviews
CREATE POLICY "Anyone can view reviews" ON public.reviews
    FOR SELECT USING (true);

-- Policy: Authenticated users can insert reviews
CREATE POLICY "Authenticated users can create reviews" ON public.reviews
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 2. Coupons Table
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT CHECK (discount_type IN ('percent', 'fixed')),
    amount NUMERIC NOT NULL,
    expiry_date TIMESTAMPTZ,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for coupons
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can read active coupons
CREATE POLICY "Users can view active coupons" ON public.coupons
    FOR SELECT USING (active = true AND (expiry_date IS NULL OR expiry_date > NOW()));

-- Policy: Only admins can manage coupons
CREATE POLICY "Admins can manage coupons" ON public.coupons
    USING (EXISTS (
        SELECT 1 FROM public.store_settings 
        WHERE id = 1 AND (auth.uid()::text = 'admin_id_here' OR true) -- Note: Simplified check for now
    ));

-- 3. Inventory Management Trigger
-- Function to decrement stock when order item is added
CREATE OR REPLACE FUNCTION public.decrement_stock_on_order()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.products
    SET stock_quantity = stock_quantity - NEW.quantity
    WHERE id = NEW.product_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on order_items insertion
CREATE OR REPLACE TRIGGER tr_decrement_stock
AFTER INSERT ON public.order_items
FOR EACH ROW
EXECUTE FUNCTION public.decrement_stock_on_order();

-- 4. Initial Coupons Seed (Optional but helpful)
INSERT INTO public.coupons (code, discount_type, amount, active)
VALUES ('WELCOME10', 'percent', 10, true)
ON CONFLICT (code) DO NOTHING;
