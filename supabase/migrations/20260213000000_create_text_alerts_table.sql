CREATE TABLE text_alert_subscriptions (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone       TEXT NOT NULL,          -- raw input for display/debug
  phone_e164  TEXT NOT NULL,          -- normalized +1XXXXXXXXXX
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX text_alerts_phone_e164 ON text_alert_subscriptions (phone_e164);
