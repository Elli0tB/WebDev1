from flask import Flask
from flask import request
from flask import jsonify
from flask_cors import CORS 
import os 
import json


    #  Using Python, create a server web application which implements an API that receives, stores, 
    # and returns simple messages, according to the following specifications:
    #CORS  should be implemented server-wide in order to support Ajax requests from client applications.
    
LOG_FILE = "messages.txt"
backend = Flask(__name__)
CORS(backend)

@backend.route('/messages', methods=['GET', 'POST'])
def messages():
    if request.method == 'POST':
        return post_mssg()
    elif request.method =='GET':
        return get_mssg()
@backend.errorhandler(404)
def not_found(error):
        return "404 Not Found: the requested path does not exist.", 404, {"Content-Type": "text/plain"}
        #If a GET or POST request is received that does not conform to the paths defined above (or any others that you choose to implement), 
        # then the server should return an appropriate Not Found response, with the correct status code, 
        # and content that properly explains the reason for this response. 
        # The content type may be plain text or HTML; set the response header correctly.
    


def post_mssg():
    message = request.json
    with open(LOG_FILE, "a") as file:
        file.write(json.dumps(message) + '\n')
    return "", 201
    #POST /messages: receives a message within the body of the request and records the message in the message log, 
    # by writing (appending) the message to a file on the local filesystem. 
    # The server should respond appropriately with the status code 201 Created. No response body content is necessary.

def get_mssg():
    if not os.path.exists(LOG_FILE):
        return jsonify([]), 200
    with open(LOG_FILE, "r") as file:
        lines = []
        for line in file:
            if line.strip():
                lines.append(json.loads(line))
    return jsonify(lines), 200
    #GET /messages: returns all messages contained within the message log, 
    # by reading the messages from the file on the local filesystem. 
    # The data should be returned as a JSON array within the response body,
    #  and the server should respond appropriately with the status code 200 OK and the Content-Type response header set correctly.





if __name__ == "__main__":
    backend.run()