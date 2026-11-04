from flask import Flask
from flask import request
from flask import g as instance
from flask import jsonify
from flask_cors import CORS 
import backend_interface
import json

# set up database
def get_db():
    if "db" not in instance:
        instance.db = backend_interface.DataBaseLoader()
    return instance.db
# set up back end server 
backend = Flask(__name__)
CORS(backend)



# --- CRUD: LIST ---
@backend.route('/character', methods=['GET'])
def char_ID_ALL_handeler(character_name):
    data_base = get_db()
    if request.method == 'GET':
        return get_all_char(data_base)

def get_all_char(db):
    rows = [dict(row) for row in db.query("SELECT * FROM character")]
    return jsonify(rows), 200

@backend.route('/character/<character_name>', methods=['GET', 'POST', 'PUT', 'DELETE', 'PATCH' ])
def char_ID_handeler(character_name):
    data_base = get_db()
    if request.method == 'GET':
        return get_char(character_name,data_base)
    if request.method =='POST':
        return post_char(character_name,data_base)
    if request.method =='PUT':
        return put_char(character_name,data_base)
    if request.method =='DELETE':
        return delete_char(character_name,data_base)
    if request.method =='PATCH':
        return patch_char(character_name,data_base)

# ---CRUD: Retrieve --- 
def get_char(character_name,db):
    rows = [dict(row) for row in db.query("SELECT * FROM character WHERE name == ?", (character_name,))]
    return jsonify(rows), 200

# ---CRUD: Create ---
def post_char(character_name,db):
    char = request.json
    # CANNOT HAVE THE SAME NAME AS ANOTHER CHAR NEEDS TO BE NEW
    match = db.query("SELECT * FROM character WHERE name == ?", (character_name,))
    if match is True:
        print("ERROR: NAME MATCHED MUST USE PUT")
        return "ERROR: NAME MATCHED MUST USE PUT", 400
    db.execute("""
        INSERT INTO users (name, char_class, combat_style, abilities, playability_status, lore)
        VALUES (?, ?, ?, ?, ?, ?)""", char) 
    return "", 201

# ---CRUD: Replace ---
def put_char(character_name,db):
    # HAS TO HAVE A MATCHING NAME. 
    char = request.json
    match = db.query("SELECT * FROM character WHERE name == ?", (character_name,))
    if match is False:
        print("ERROR: NAME MATCHED MUST USE POST")
        return "ERROR: NAME MATCHED MUST USE POST", 400
    db.execute("""
        INSERT characters (name, char_class, combat_style, abilities, playability_status, lore) 
        VALUES (?, ?, ?, ?, ?, ?)""", char)
    return "", 201


# -- CRUD: Delete --
def delete_char(character_name,db):
    match = db.query("SELECT * FROM character WHERE name == ?", (character_name,))
    if match is False:
        print("ERROR: NAME NOT FOUND")
        return "ERROR: NAME NOT FOUND", 400
    db.execute("DELETE FROM users WHERE name == ?", character_name)
    return "", 201

# ---CRUD: Replace ---
#only partly
def patch_char(character_name,db):
    """INSERT INTO users (id, name, email, last_login)
    VALUES (1, 'Alice', 'alice@example.com', NOW())
    ON CONFLICT (id) 
    DO UPDATE SET last_login = EXCLUDED.last_login;"""
    ...





@backend.errorhandler(404)
def not_found(error):
        return "404 Not Found: the requested path does not exist.", 404, {"Content-Type": "text/plain"}
        #If a GET or POST request is received that does not conform to the paths defined above (or any others that you choose to implement), 
        # then the server should return an appropriate Not Found response, with the correct status code, 
        # and content that properly explains the reason for this response. 
        # The content type may be plain text or HTML; set the response header correctly.


@backend.teardown_appcontext
def close_db(exc):
    db = instance.pop("db", None)
    if db is not None:
        db.close()


if __name__ == "__main__":
    backend.run()


