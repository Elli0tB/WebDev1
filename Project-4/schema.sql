CREATE TABLE IF NOT EXISTS characters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    char_class TEXT NOT NULL,
    combat_style TEXT NOT NULL,
    abilities TEXT NOT NULL,
    playability_status TEXT NOT NULL,
    lore TEXT NOT NULL
);