from flask import Flask
from flask import request
from flask import g as instance
from flask import jsonify
from flask_cors import CORS 
import backend_interface
import json

# set up database interface nice and clean 
def get_db():
    if "db" not in instance:
        instance.db = backend_interface.DataBaseLoader()
    return instance.db
# set up back end server 
backend = Flask(__name__)
CORS(backend)



# --- CRUD: LIST ---
@backend.route('/character', methods=['GET'])
def char_ID_ALL_handeler():
    data_base = get_db()
    if request.method == 'GET':
        return get_all_char(data_base)

def get_all_char(db):
    rows = [dict(row) for row in db.query("SELECT * FROM characters")]
    return jsonify(rows), 200

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


