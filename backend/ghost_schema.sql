-- Migration for Sprint 2.3: Ghost Wreckages
CREATE TABLE IF NOT EXISTS ghost_wrecks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_name TEXT NOT NULL,
    death_score INTEGER NOT NULL,
    x_offset REAL DEFAULT 0,
    y_pos REAL DEFAULT 350,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ghosts_score ON ghost_wrecks(death_score DESC);