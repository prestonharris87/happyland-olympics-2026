CREATE TABLE page_views (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         TEXT NOT NULL,
  username        TEXT NOT NULL,
  path            TEXT NOT NULL DEFAULT '/',
  referrer        TEXT,
  user_agent      TEXT,
  ip_address      TEXT,
  city            TEXT,
  region          TEXT,
  country         TEXT,
  latitude        DOUBLE PRECISION,
  longitude       DOUBLE PRECISION,
  screen_width    INTEGER,
  screen_height   INTEGER,
  viewport_width  INTEGER,
  viewport_height INTEGER,
  timezone        TEXT,
  language        TEXT,
  color_scheme    TEXT,
  connection_type TEXT,
  session_id      UUID,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX page_views_user_id_created ON page_views (user_id, created_at DESC);
CREATE INDEX page_views_session_id ON page_views (session_id) WHERE session_id IS NOT NULL;
CREATE INDEX page_views_country_created ON page_views (country, created_at DESC) WHERE country IS NOT NULL;
CREATE INDEX page_views_created_at ON page_views (created_at DESC);
