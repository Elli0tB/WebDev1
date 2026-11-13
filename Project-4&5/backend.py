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
CORS(backend)
load_dotenv() # reads .env and adds its values to os.environ

backend.config.update(
    SECRET_KEY=os.environ["SECRET_KEY"],       # long, random, never hardcoded
    SESSION_COOKIE_HTTPONLY=True,              # JS can't read it
    SESSION_COOKIE_SECURE=os.environ.get("FLASK_ENV_MODE") != "dev", # off when the .env has the dev flag on
    SESSION_COOKIE_SAMESITE="Lax",             # CSRF mitigation
    PERMANENT_SESSION_LIFETIME=timedelta(hours=2),
)
backend.config["PERMANENT_SESSION_LIFETIME"] = timedelta(hours=2)



#---User Endpoints---
@backend.route("/")
def home():
    if "user" in session:
        return render_template("dashboard.html")
    return render_template("landing.html")

#login page
@backend.route('/login', methods=['GET'])
def get_user():  # this needs to verify a user and send them to the homepage!
    data_base = get_db()
    requested_user = request.get_json()
    user = data_base.query("SELECT * FROM users WHERE email = ?", (requested_user[2],))
    if not user:
        return jsonify({"valid_account": False}), 404
    if check_credentials(user,data_base):
        session.clear()               # rotate on login
        session.permanent = True      # opt in to expiry
        session["session_id"] = get_user_ID(user[2],data_base)
        return redirect(url_for("dashboard")) 
    return jsonify({"valid_password": False}), 401

def check_credentials(user,):
    requested_user = request.get_json()
    salt, expected = user[3][:16], user[3][16:]
    attempt = hashlib.pbkdf2_hmac("sha256", requested_user[3].encode("utf-8"), salt, 600_000)
    succes = hmac.compare_digest(attempt, expected)  # constant-time compare
    if not succes:
            return False
    return True

def get_user_ID(email,db):
    user = db.query("SELECT * FROM users WHERE email = ?", (email,))
    return user[4]

@backend.route('/signup', methods=['POST'])
def post_user():
    user = request.get_json()
    db = get_db()
    # see if user already exists emails MUST BE UNQIE 
    if db.query("SELECT 1 FROM users WHERE email = ?", (user[2],)):
        return "ERROR: USER ALL READY EXISTS", 409
    #encrypt the password
    user_pswrd = user[3].encode("utf-8")
    salt = os.urandom(16)
    key = hashlib.pbkdf2_hmac("sha256", user_pswrd, salt, 600_000)
    storedVal = salt + key
    encrypted_pswrd = storedVal.hex()
    user[3] = encrypted_pswrd
    user_id = makeUID(db)
    
    #store the user
    db.execute("""
        INSERT INTO users (firstName, lastName, email, password, id)
        VALUES (?, ?, ?, ?, ?)""", (user[:4],user_id))
    # return the user object without the pswrd hash and UID 
    return json.dumps(user[:3]), 201

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
    return render_template("dashboard.html")

# --- CRUD: LIST ---
@backend.route('/character', methods=['GET'])
def char_ID_ALL_handeler():
    data_base = get_db()
    if request.method == 'GET':
        return get_all_char(data_base)

def get_all_char(db):
    rows = [dict(row) for row in db.query("SELECT * FROM characters")]
    return jsonify(rows), 200


#---Character Endpoints--

@backend.route('/character/<character_name>', methods=['GET', 'POST', 'PUT', 'DELETE', 'PATCH' ])
def char_ID_handeler(character_name):
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
    char = request.json
    if db.query("SELECT 1 FROM characters WHERE name = ?", (character_name,)):
        return "ERROR: NAME MATCHED MUST USE PUT", 409
    db.execute("""
        INSERT INTO characters (name, char_class, combat_style, abilities, playability_status, lore)
        VALUES (?, ?, ?, ?, ?, ?)""", tuple(char[:6]))
    return json.dumps(char), 201

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
    char = request.json
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
    backend.run()

