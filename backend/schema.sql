-- Schema SQLite Cloudflare D1: Drunk Rocket Leaderboard
CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_name TEXT NOT NULL,
    score INTEGER NOT NULL,
    duration_ms INTEGER DEFAULT 0,
    client_hash TEXT,
    ip_country TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_scores_alltime ON scores(score DESC, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_scores_daily ON scores(created_at DESC, score DESC);
