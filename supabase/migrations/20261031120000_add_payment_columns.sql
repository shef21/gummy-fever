-- Provider-neutral payment columns and idempotent webhook deliveries.
-- Apply this in the Supabase SQL editor (or `supabase db push`). Do not apply from the app.

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS payment_provider TEXT,
  ADD COLUMN IF NOT EXISTS payment_reference TEXT,
  ADD COLUMN IF NOT EXISTS payment_status TEXT,
  ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;

CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_payment_reference
  ON orders (payment_reference)
  WHERE payment_reference IS NOT NULL;

-- Orders are created server-side with the service role after totals are recomputed.
-- Remove the client insert path so callers cannot write their own totals/status.
DROP POLICY IF EXISTS "Users can create their own orders" ON orders;

CREATE TABLE IF NOT EXISTS payment_webhook_events (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  payload JSONB,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payment_webhook_events_order
  ON payment_webhook_events(order_id);

ALTER TABLE payment_webhook_events ENABLE ROW LEVEL SECURITY;
