# s24-hellojs-Elli0tB
This is my Web Application Development 1 Class 
Durning this class I will be storeing notes, intresting topics, and usefull tips, and project notes I learn in the DevJournal file.


# D&D Character Archive md

A small web app for storing, viewing, modifying, and deleting Dungeons & Dragons characters. A Flask API backed by SQLite serves the data, and a JavaScript client talks to it with Ajax requests.

## Resource

**Character**: a single D&D character in the archive.

| Attribute            | Description                                              |
|----------------------|----------------------------------------------------------|
| `id`                 | Unique identifier, assigned automatically by the database |
| `name`               | The character's name (must be unique)                    |
| `char_class`         | The character's class (e.g. Rogue, Barbarian)            |
| `combat_style`       | A short description of how the character fights          |
| `abilities`          | The character's notable abilities                        |
| `playability_status` | Whether the character is currently alive or deceased     |
| `lore`               | The character's backstory                                |

## Database Schema

```sql
CREATE TABLE IF NOT EXISTS characters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    char_class TEXT NOT NULL,
    combat_style TEXT NOT NULL,
    abilities TEXT NOT NULL,
    playability_status TEXT NOT NULL,
    lore TEXT NOT NULL
);
```

## REST Endpoints

| Name     | Method   | Path                        | Description                                         | Success Status |
|----------|----------|-----------------------------|-----------------------------------------------------|----------------|
| List     | `GET`    | `/character`                | Returns a JSON list of all characters               | `200`          |
| Retrieve | `GET`    | `/character/<name>`         | Returns a JSON object for one character             | `200`          |
| Create   | `POST`   | `/character/<name>`         | Creates a new character from the JSON request body  | `201`          |
| Replace  | `PUT`    | `/character/<name>`         | Updates an existing character from the request body | `204`          |
| Update   | `PATCH`  | `/character/<name>`         | Updates an existing character from the request body | `204`          |
| Delete   | `DELETE` | `/character/<name>`         | Removes a character                                 | `204`          |

### Error Responses

| Status | When                                                                  |
|--------|-----------------------------------------------------------------------|
| `404`  | The path does not exist, or the named character does not exist        |
| `409`  | A `POST` was made with a name that already exists                     |

CORS is enabled server-wide, including `OPTIONS` preflight requests.

## Running the Project

1. Install the dependencies: `pip install flask flask-cors`
2. Start the server: `python backend.py`
3. Open `index.html` in a browser. The server runs at `http://127.0.0.1:5000`.