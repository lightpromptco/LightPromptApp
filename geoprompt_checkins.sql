-- GeoPrompt Check-ins Table
CREATE TABLE IF NOT EXISTS geoprompt_check_ins (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL,
  location TEXT NOT NULL,
  custom_location TEXT,
  map_address TEXT,
  map_lat REAL,
  map_lng REAL,
  map_place_id TEXT,
  vibe TEXT NOT NULL,
  display_name TEXT DEFAULT 'anonymous',
  custom_name TEXT,
  custom_initials TEXT,
  reflection TEXT NOT NULL,
  share_publicly BOOLEAN DEFAULT false,
  logo_photos JSONB DEFAULT '[]',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);