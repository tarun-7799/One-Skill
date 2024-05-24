import pyrebase
import os
import base64
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Firebase configuration
firebase_config = {
    # Your Firebase project configuration
}

firebase = pyrebase.initialize_app(firebase_config)
storage = firebase.storage()
db = firebase.database()

# Define a folder to temporarily store uploaded images
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure the upload folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route("/jobSeekerRegistration", methods=["POST"])
def registration():
    try:
        name = request.json["name"]
        email = request.json["email"]
        mobile = request.json["mobile"]
        password = request.json["password"]
        dob = request.json["dob"]
        gender = request.json["gender"]
        skills = request.json["skills"]
        experience = request.json["experience"]
        image_url = save_image(request.json["image"])  # Save the image and get its URL
        jobRole = request.json["jobRole"]
        major = request.json["skills"]["major"]
        minors = request.json["skills"].get("minors", [])
        current_ctc = request.json["current_ctc"]
        expected_ctc = request.json["expected_ctc"]
        
        users = Users()
        message = users.add_job_seeker(name, email, mobile, password, dob, gender, major, minors, experience, image_url, jobRole, current_ctc, expected_ctc)
        
        return jsonify({"message": message}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

def save_image(base64_image):
    try:
        # Remove metadata if present
        if base64_image.startswith('data:image'):
            base64_image = base64_image.split(';base64,')[1]
        
        # Decode the base64 image data
        image_data = base64.b64decode(base64_image)
        
        # Generate a unique filename
        filename = os.path.join(app.config['UPLOAD_FOLDER'], 'image.png')
        
        # Save the image to disk temporarily
        with open(filename, 'wb') as f:
            f.write(image_data)
        
        # Upload image to Firebase Storage
        storage.child("images/jobseekers/" + filename).put(filename)
        
        # Get the URL of the uploaded image
        image_url = storage.child("images/jobseekers/" + filename).get_url(None)
        
        # Remove the temporary image file
        os.remove(filename)
        
        return image_url
    except Exception as e:
        raise e



@app.route("/jobSeekerRegistration", methods=["POST"])
def registration():
    try:
        name = request.json["name"]
        email = request.json["email"]
        mobile = request.json["mobile"]
        password = request.json["password"]
        dob = request.json["dob"]
        gender = request.json["gender"]
        skills = request.json["skills"]
        experience = request.json["experience"]
        image = save_image(request.json["image"])  # Save the image and get its URL
        jobRole = request.json["jobRole"]
        major = request.json["skills"]["major"]
        minors = request.json["skills"].get("minors", [])
        current_ctc = request.json["current_ctc"]
        expected_ctc = request.json["expected_ctc"]
        
        users = Users()
        message = users.add_job_seeker(name, email, mobile, password, dob, gender, major, minors, experience, image, jobRole, current_ctc, expected_ctc)
        
        return jsonify({"message": message}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

def save_image(base64_image):
    # Remove metadata if present
    if base64_image.startswith('data:image'):
        base64_image = base64_image.split(';base64,')[1]
    
    # Decode the base64 image data
    image_data = base64.b64decode(base64_image)
    
    # Generate a unique filename
    filename = os.path.join(app.config['UPLOAD_FOLDER'], 'image.png')
    
    # Save the image to disk
    with open(filename, 'wb') as f:
        f.write(image_data)
    
    # Return the URL or path of the saved image
    return filename  # This is just an example, you should return the URL or path as needed

@app.route("/forgotPassword", methods=["PUT"])
def forgot_password():
    try:
        email = request.json["email"]
        new_password = request.json["password"]
        
        users = Users()
        message = users.job_seeker_forgot_password(email, new_password)
        
        return jsonify({"message": message}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/jobSeekerLogin", methods=["POST"])
def login():
    try:
        email = request.json["email"]
        password = request.json["password"]
        
        users = Users()
        message = users.job_seeker_login(email, password)
        
        return jsonify({"message": message}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/allJobSeekers", methods=["GET"])
def get_all_job_seekers():
    try:
        users = Users()
        job_seekers = users.get_job_seekers()
        
        return jsonify(job_seekers), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/updateJobSeekerDetails", methods=["PUT"])
def update_details():
    try:
        email = request.json["email"]
        major = request.json["skills"]["major"]
        minors = request.json["skills"].get("minors", [])
        experience = request.json["experience"]
        image = request.json["image"]
        jobRole = request.json["jobRole"]
        current_ctc = request.json["current_ctc"]
        expected_ctc = request.json["expected_ctc"]
        
        users = Users()
        message = users.update_job_seeker_details(email, major, minors, experience, image, jobRole, current_ctc, expected_ctc)
        
        return jsonify({"message": message}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True)
