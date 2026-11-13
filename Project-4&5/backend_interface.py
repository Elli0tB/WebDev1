import sqlite3 
import hashlib
from pathlib import Path

SCHEMA_PATH = Path(__file__).parent / "schema.sql"
class DataBaseLoader:
    def __init__(self, path="app.db", seed=False):
        self.connection = sqlite3.connect(path)
        self.connection.row_factory = sqlite3.Row
        self._create_tables()
        if seed:
            self._seed()

    def _create_tables(self):
        schema = SCHEMA_PATH.read_text()
        self.connection.executescript(schema)

    def _seed(self):
        default_characters = [
            (
                "La Vichi",
                "Rogue",
                "A hit and run ambusher skilled in poison and trapping enemies.",
                "Sneak Attack, Poison Arrow, Fire Bombs",
                "Deceased",
                "A daring rogue who has traveled the world of Phandalin, seeking to release Primus from his locks and stopping cults from unleashing the end of the world. In the end he gave his life to protect those he cared about.",
            ),
            (
                "Barbra-Ham",
                "Barbarian",
                "Throws everything and everyone in sight.",
                "Rage, Throw, Grand Slam",
                "Alive",
                "A bold and downright reckless dwarf who travels for the thrill of it, spending most of his time in taverns trying every bit of food he can get, then heading out to suplex a goblin in a back alley.",
            ),
        ]

        self.connection.executemany(
            """INSERT OR IGNORE INTO characters
               (name, char_class, combat_style, abilities, playability_status, lore)
               VALUES (?, ?, ?, ?, ?, ?)""",
            default_characters,
        )
        default_users = [
            (
                "Elliot",
                "Bangerter",
                "elliot.bangerter@gmail.com",
                "fc152261b4e7de27bc5d803728ead2e6c0d66a76c96688440333317686bae872",
                "0",
            )]
        self.connection.executemany(
            """INSERT OR IGNORE INTO users
                (firstName, lastNmae, email, password, id, )
                VALUES (?, ?, ?, ?, ?)""",
            default_users,
        )
        # make the defult users 
        self.connection.commit()

    def execute(self, sql, params=()):
        """Run a statement that changes data (INSERT, UPDATE, DELETE, CREATE)."""
        cursor = self.connection.execute(sql, params)
        self.connection.commit()
        return cursor

    def query(self, sql, params=()):
        """Run a SELECT and return all matching rows."""
        return self.connection.execute(sql, params).fetchall()

    def close(self):
        self.connection.close()

    # These two let you use `with DataBaseLoader() as data_base:`
    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.close()

