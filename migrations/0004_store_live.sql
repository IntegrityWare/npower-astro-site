-- Live orders use their own D1 binding; the existing trial ledger is never moved.
ALTER TABLE cart_orders ADD COLUMN buyer_email TEXT;
ALTER TABLE cart_orders ADD COLUMN buyer_name TEXT;
ALTER TABLE cart_units ADD COLUMN customer_id INTEGER;
