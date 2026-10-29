-- Yoco Online Payments: store checkout/payment ids and idempotent webhook deliveries.
-- Apply this in the Supabase SQL editor (or `supabase db push`). Do not apply from the app.

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS yoco_checkout_id TEXT,
  ADD COLUMN IF NOT EXISTS yoco_payment_id TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_yoco_checkout_id
  ON orders (yoco_checkout_id)
  WHERE yoco_checkout_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_yoco_payment_id
  ON orders (yoco_payment_id)
  WHERE yoco_payment_id IS NOT NULL;

-- Orders are created server-side with the service role after totals are recomputed.
-- Remove the client insert path so callers cannot write their own totals/status.
DROP POLICY IF EXISTS "Users can create their own orders" ON orders;

CREATE TABLE IF NOT EXISTS yoco_webhook_events (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  payload JSONB,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_yoco_webhook_events_order
  ON yoco_webhook_events(order_id);

ALTER TABLE yoco_webhook_events ENABLE ROW LEVEL SECURITY;
