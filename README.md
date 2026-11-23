# s24-hellojs-Elli0tB
This is my Web Application Development 1 Class 
Durning this class I will be storeing notes, intresting topics, and usefull tips, and project notes I learn in the DevJournal file.

# D&D Character Archive Project-4 MD 

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


# D&D Character Archive Project-5 MD 
make sure to include that your own .env with a secret key needs to be stored. 

# D&D Character Archive

A small full-stack web app for storing, searching, modifying, and deleting Dungeons & Dragons characters. Users create an account, log in, and manage a shared archive of characters through a REST API built with Flask and SQLite.

## Running the project

1. Create a `.env` file with a long random secret key:
   ```
   SECRET_KEY=<long random string>
   FLASK_ENV_MODE=dev
   ```
   `FLASK_ENV_MODE=dev` turns off the `Secure` flag on the session cookie so it works over plain `http://` during local development. Leave it unset in production.
2. Install dependencies: `pip install flask flask-cors python-dotenv`
3. Start the server: `python server.py` (runs on port `5001`; the filename may differ in your repo)
4. Serve the front-end files (for example with Live Server on port `5500`) and open the landing page.

On startup the server calls `backend_interface.DataBaseLoader(seed=True)` to create and seed the database.

---

## Resources

### User

Represents a registered account.

| Attribute   | Type | Description |
|-------------|------|-------------|
| `id`        | TEXT | Randomly generated 15-digit identifier (unique). Stored in the session on login. |
| `firstName` | TEXT | The user's first name. |
| `lastName`  | TEXT | The user's last name. |
| `email`     | TEXT | The user's email address (unique, used to log in). |
| `password`  | TEXT | Hex-encoded salt + PBKDF2 hash. The plaintext password is never stored. |

### Character

Represents a D&D character in the archive. The `name` is unique and is used as the lookup key in the API.

| Attribute            | Type    | Description |
|----------------------|---------|-------------|
| `id`                 | INTEGER | Auto-incrementing primary key. |
| `name`               | TEXT    | The character's name (unique). |
| `char_class`         | TEXT    | The character's class (e.g. Wizard, Rogue). |
| `combat_style`       | TEXT    | How the character fights. |
| `abilities`          | TEXT    | The character's abilities. |
| `playability_status` | TEXT    | Whether or not the character is playable. |
| `lore`               | TEXT    | Backstory and lore. |

---

## Database Schema

The database is SQLite. The tables are defined as follows:

```sql
CREATE TABLE users (
    firstName TEXT NOT NULL,
    lastName  TEXT NOT NULL,
    email     TEXT NOT NULL UNIQUE,
    password  TEXT NOT NULL,
    id        TEXT NOT NULL PRIMARY KEY
);

CREATE TABLE characters (
    id                 INTEGER PRIMARY KEY AUTOINCREMENT,
    name               TEXT NOT NULL UNIQUE,
    char_class         TEXT,
    combat_style       TEXT,
    abilities          TEXT,
    playability_status TEXT,
    lore               TEXT
);
```

---

## REST API Endpoints

All endpoints accept and return JSON unless noted. Every `/character` endpoint requires an authenticated session and returns `401 {"error": "login required"}` otherwise.

### Pages

| Name      | Path         | Method | Description |
|-----------|--------------|--------|-------------|
| Home      | `/`          | GET    | Renders `dashboard.html` if logged in, otherwise `landing.html`. |
| Dashboard | `/dashboard` | GET    | Renders `dashboard.html`. Returns `401` if not logged in. |

### Users and Authentication

| Name         | Path                  | Method | Description |
|--------------|-----------------------|--------|-------------|
| Check email  | `/email?email=<addr>` | GET    | Checks whether an email is already registered. `200` if available, `409` if taken, `400` if missing. |
| Sign up      | `/signup`             | POST   | Creates a user and logs them in. Body: `firstName`, `lastName`, `email`, `password`. Returns `201` with the user's name and email, `400` for missing fields, or `409` if the user already exists. |
| Log in       | `/login`              | POST   | Body: `email`, `password`. Returns `200` and sets the session cookie, `400` for missing fields, or `401` for invalid credentials. |

### Characters

| Name                | Path                         | Method         | Description |
|---------------------|------------------------------|----------------|-------------|
| List characters     | `/character`                 | GET            | Returns every character as a JSON array. `200`. |
| Get character       | `/character/<character_name>`| GET            | Returns one character. `200`, or `404` if not found. |
| Create character    | `/character/<character_name>`| POST           | Body: `char_class`, `combat_style`, `abilities`, `playability_status`, `lore`. Returns `201`, or `409` if the name already exists. |
| Update character    | `/character/<character_name>`| PATCH          | Partially updates a character. Any field omitted or sent as `"N/A"` keeps its existing value. Returns `204`, or `404` if not found. |
| Update character    | `/character/<character_name>`| PUT            | Currently handled identically to `PATCH`. |
| Delete character    | `/character/<character_name>`| DELETE         | Deletes a character. Returns `204`, or `404` if not found. |

---

## Password Hashing

Passwords are hashed with **PBKDF2-HMAC-SHA256** using Python's `hashlib.pbkdf2_hmac`.

| Parameter        | Value |
|------------------|-------|
| Algorithm        | PBKDF2 with HMAC-SHA256 |
| Iterations       | 600,000 |
| Salt             | 16 random bytes from `os.urandom`, unique per user |
| Derived key size | 32 bytes (the SHA-256 default) |
| Stored format    | `hex(salt + derived_key)` in the `password` column |

On login, the salt is read from the first 16 bytes of the stored value, the submitted password is hashed with the same parameters, and the result is compared to the stored hash using `hmac.compare_digest` (constant-time comparison).

## Sessions and Security Notes

- Sessions use Flask's signed cookie sessions. `SECRET_KEY` is loaded from the environment and is never hardcoded.
- Cookie flags: `HttpOnly`, `SameSite=Lax`, and `Secure` (disabled only when `FLASK_ENV_MODE=dev`).
- Sessions are permanent with a 2-hour lifetime and are cleared and reissued on login and signup.
- All SQL uses parameterized queries.
- CORS is restricted to the front-end origins (`http://127.0.0.1:5500` and `http://localhost:5500`) with credentials enabled.
- The front end renders character data with `textContent`/`append`, not `innerHTML`, to avoid XSS.

## Project Structure

```
.
├── server.py              # Flask app and REST endpoints
├── backend_interface.py   # DataBaseLoader (SQLite wrapper and seeding)
├── templates/
│   ├── landing.html       # Login / sign-up page
│   └── dashboard.html     # Character management page
├── userScripter.js        # Landing page logic (login / sign-up)
├── scripter.js            # Dashboard logic (character CRUD)
├── userStyle.css
└── style.css
```