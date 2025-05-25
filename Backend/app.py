from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId

app = Flask(__name__)

# MongoDB connection
client = MongoClient('mongodb://localhost:27017')
db = client['flaskreact']
CORS(app)

@app.route('/')
def index():
    return jsonify({"message": "Welcome to the Flask API"}), 200

@app.route('/users', methods=['POST', 'GET'])
def data():
    if request.method == 'POST':
        body = request.get_json(force=True)
        firstname = body.get('firstname')
        lastname = body.get('lastname')
        email = body.get('email')

        if not firstname or not lastname or not email:
            return jsonify({"error": "Missing required fields"}), 400

        db['users'].insert_one({
            "firstname": firstname,
            "lastname": lastname,
            "email": email
        })

        return jsonify({
            "status": "User created successfully",
            "firstname": firstname,
            "lastname": lastname,
            "email": email
        }), 201

    if request.method == 'GET':
        allData = db['users'].find()
        dataJSON = []
        for data in allData:
            id = data['_id']
            firstname = data["firstname"]
            lastname = data["lastname"]
            email = data["email"]
            dataDict = {
                'id': str(id),
                'firstname': firstname,
                'lastname': lastname,
                'email': email
            }
            dataJSON.append(dataDict)
        return jsonify(dataJSON), 200

@app.route('/users/<string:id>', methods=['GET', 'PUT', 'DELETE'])
def onedata(id):
    if request.method == 'GET':
        try:
            data = db['users'].find_one({"_id": ObjectId(id)})
            if data:
                id = data['_id']
                firstname = data["firstname"]
                lastname = data["lastname"]
                email = data["email"]

                dataDict = {
                    'id': str(id),
                    'firstname': firstname,
                    'lastname': lastname,
                    'email': email
                }
                return jsonify(dataDict), 200
            else:
                return jsonify({"error": "User not found"}), 404
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    if request.method == 'DELETE':
        try:
            result = db['users'].delete_one({"_id": ObjectId(id)})
            if result.deleted_count == 1:
                return jsonify({
                    "status": f"User deleted: {id} successfully deleted"
                }), 200
            else:
                return jsonify({"error": "User not found"}), 404
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    if request.method == 'PUT':
        try:
            body = request.get_json(force=True)

            update_data = {}
            if 'firstname' in body:
                update_data['firstname'] = body['firstname']
            if 'lastname' in body:
                update_data['lastname'] = body['lastname']
            if 'email' in body:
                update_data['email'] = body['email']

            if not update_data:
                return jsonify({"error": "No fields to update"}), 400

            result = db['users'].update_one(
                {"_id": ObjectId(id)},
                {"$set": update_data}
            )
            if result.matched_count == 0:
                return jsonify({"error": "User not found"}), 404

            return jsonify({
                "status": "User updated successfully",
                **update_data
            }), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
