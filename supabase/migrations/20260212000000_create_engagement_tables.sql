-- Hearts table: tracks which users hearted which media items
CREATE TABLE hearts (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  media_id   TEXT NOT NULL,
  user_id    TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE UNIQUE INDEX hearts_user_media ON hearts (user_id, media_id);
CREATE INDEX hearts_media_id ON hearts (media_id);

-- Comments table: stores user comments on media items
CREATE TABLE comments (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  media_id   TEXT NOT NULL,
  user_id    TEXT NOT NULL,
  username   TEXT NOT NULL,
  body       TEXT NOT NULL CHECK (char_length(body) <= 500),
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX comments_media_id ON comments (media_id, created_at ASC);
