from flask import Flask, session, redirect, url_for, render_template, request, jsonify
from flask import g as instance
from flask_cors import CORS 
import backend_interface
import json, os, hashlib, hmac, random, string
from datetime import timedelta
from dotenv import load_dotenv

# set up database interface nice and clean 
def get_db():
    if "db" not in instance:
        instance.db = backend_interface.DataBaseLoader()
    return instance.db
# set up back end server 
backend = Flask(__name__)
CORS(backend, supports_credentials=True,
     origins=["http://127.0.0.1:5500", "http://localhost:5500"])# whatever origin serves your pages
load_dotenv() # reads .env and adds its values to os.environ

backend.config.update(
    SECRET_KEY=os.environ["SECRET_KEY"],       # long, random, never hardcoded
    SESSION_COOKIE_HTTPONLY=True,              # JS can't read it
    SESSION_COOKIE_SECURE=os.environ.get("FLASK_ENV_MODE") != "dev", # off when the .env has the dev flag on
    SESSION_COOKIE_SAMESITE="Lax",             # CSRF mitigation
    PERMANENT_SESSION_LIFETIME=timedelta(hours=2),
)

#---User Endpoints---
@backend.route("/")
def home():
    if "user" in session:
        return render_template("dashboard.html")
    return render_template("landing.html")



#login page
@backend.route('/login', methods=['POST'])
def login():
    db = get_db()
    data = request.get_json() or {}
    email, password = data.get("email"), data.get("password")
    if not email or not password:
        return jsonify({"error": "email and password required"}), 400

    rows = db.query("SELECT * FROM users WHERE email = ?", (email,))
    if not rows or not check_credentials(rows[0], password):
        return jsonify({"error": "invalid credentials"}), 401

    session.clear()
    session.permanent = True
    session["user"] = rows[0]["id"]
    return jsonify({"ok": True}), 200

def check_credentials(user, password):
    stored = bytes.fromhex(user["password"])
    salt, expected = stored[:16], stored[16:]
    attempt = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 600_000)
    return hmac.compare_digest(attempt, expected)
   
def get_user_ID(email,db):
    user = db.query("SELECT * FROM users WHERE email = ?", (email,))
    return user[4]

@backend.route('/signup', methods=['POST'])
def post_user():
    data = request.get_json() or {}
    db = get_db()
    if not all(k in data for k in ("firstName", "lastName", "email", "password")):
        return jsonify({"error": "missing fields"}), 400
    if db.query("SELECT 1 FROM users WHERE email = ?", (data["email"],)):
        return jsonify({"error": "user already exists"}), 409

    salt = os.urandom(16)
    key = hashlib.pbkdf2_hmac("sha256", data["password"].encode("utf-8"), salt, 600_000)
    hashed = (salt + key).hex()
    user_id = makeUID(db)

    db.execute(
        "INSERT INTO users (firstName, lastName, email, password, id) VALUES (?, ?, ?, ?, ?)",
        (data["firstName"], data["lastName"], data["email"], hashed, user_id),
    )
    session.clear()
    session.permanent = True
    session["user"] = user_id
    return jsonify({"firstName": data["firstName"],
                    "lastName": data["lastName"],
                    "email": data["email"]}), 201

def makeUID(db):
    #we need to make a large amount of id's so lets treat id's as the following 
    # evey id will be (123456789012345) 15 digits long this will give us 10^15 id's which is probably enough we just cant have any over lap 
    n = 15 # this is the amount of digits
    id_invalid = True
    while id_invalid:
        id = ''.join(random.choices(string.digits, k=n))
        if not db.query("SELECT 1 FROM users WHERE id = ?", (id,)):
            id_invalid = False
    return id


@backend.route("/dashboard")
def dashboard():
    if "user" not in session:
        return jsonify({"error": "login required"}), 401
    return render_template("dashboard.html")

# --- CRUD: LIST ---
@backend.route('/character', methods=['GET'])
def char_ID_ALL_handeler():
    if "user" not in session:
        return jsonify({"error": "login required"}), 401
    data_base = get_db()
    if request.method == 'GET':
        return get_all_char(data_base)

def get_all_char(db):
    rows = [dict(row) for row in db.query("SELECT * FROM characters")]
    return jsonify(rows), 200


#---Character Endpoints--

@backend.route('/character/<character_name>', methods=['GET', 'POST', 'PUT', 'DELETE', 'PATCH' ])
def char_ID_handeler(character_name):
    if "user" not in session:
        return jsonify({"error": "login required"}), 401
    data_base = get_db()
    if request.method == 'GET':
        return get_char(character_name,data_base)
    if request.method =='POST':
        return post_char(character_name,data_base)
    if request.method =='PUT':
        #return put_char(character_name,data_base) again i think this can just be patch
        return patch_char(character_name,data_base)
    if request.method =='DELETE':
        return delete_char(character_name,data_base)
    if request.method =='PATCH':
        return patch_char(character_name,data_base)

# ---CRUD: Retrieve --- 
def get_char(character_name,db):
    rows = db.query("SELECT * FROM characters WHERE name = ?", (character_name,))
    if not rows:
        return jsonify({"error": "NAME NOT FOUND"}), 404
    return jsonify(dict(rows[0])), 200

# ---CRUD: Create ---
def post_char(character_name, db):
    char = request.get_json() or {}
    if db.query("SELECT 1 FROM characters WHERE name = ?", (character_name,)):
        return jsonify({"error": "name already exists"}), 409
    db.execute(
        """INSERT INTO characters (name, char_class, combat_style, abilities, playability_status, lore)
           VALUES (?, ?, ?, ?, ?, ?)""",
        (character_name, char.get("char_class"), char.get("combat_style"),
         char.get("abilities"), char.get("playability_status"), char.get("lore")),
    )
    return jsonify(char), 201

# -- CRUD: Delete --
def delete_char(character_name,db):
    match = db.query("SELECT * FROM characters WHERE name == ?", (character_name,))
    if not match:
        print("ERROR: NAME NOT FOUND")
        return "ERROR: NAME NOT FOUND", 404
    db.execute("DELETE FROM characters WHERE name == ?", (character_name,))
    return "", 204

# ---CRUD: Replace ---
COLUMNS = ["char_class", "combat_style", "abilities", "playability_status", "lore"]
def patch_char(character_name,db):
    # HAS TO HAVE A MATCHING NAME. 
    char = request.get_json(silent=True) or {}
    match = db.query("SELECT * FROM characters WHERE name == ?", (character_name,))
    if not match:
        print("ERROR: NAME NOT FOUND ")
        return "ERROR: NAME NOT FOUND", 404
    values = [
        None if char.get(col, "N/A") == "N/A" else char[col]
        for col in COLUMNS
    ]
    set_clause = ", ".join(f"{col} = COALESCE(?, {col})" for col in COLUMNS)
    db.execute(
        f"UPDATE characters SET {set_clause} WHERE name = ?",
        (*values, character_name),
    )
    return "", 204

@backend.errorhandler(404)
def not_found(error):
        return "404 Not Found: the requested path does not exist.", 404, {"Content-Type": "text/plain"}
      
#tear down the db interface 
@backend.teardown_appcontext
def close_db(exc):
    db = instance.pop("db", None)
    if db is not None:
        db.close()


if __name__ == "__main__":
    with backend_interface.DataBaseLoader(seed=True):
        pass
    backend.run(port=5001)

