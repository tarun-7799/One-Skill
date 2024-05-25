from flask import Flask, jsonify, request
from flask_cors import CORS
from database import Users

app = Flask(__name__)
CORS(app)

@app.post("/jobSeekerRegistration")
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
        image = request.json["image"]
        jobRole = request.json["jobRole"]
        major = request.json["skills"]["major"]
        minors = request.json["skills"].get("minors", [])
        current_ctc = request.json["current_ctc"]
        expected_ctc = request.json["expected_ctc"]
        linkedin = request.json["linkedin"]
        github = request.json["github"]
        job_freelance = request.json["job_freelance"]
        other_links = {}
        if "other_links" in request.json:
            for key, value in request.json["other_links"].items():
                if isinstance(value, str):
                    other_links[key] = value
                else:
                    return jsonify({"error": "Invalid value in other_links"}), 400

        users = Users()
        message = users.add_job_seeker(name, email, mobile, password, dob, gender, major, minors, experience, image, jobRole, current_ctc, expected_ctc, linkedin, github, other_links, job_freelance)

        return jsonify({"message": message}), 200
    except KeyError as e:
        return jsonify({"error": f"Missing key: {e}"}), 400
    except Exception as e:
        print("error", str(e))
        return jsonify({"error": str(e)}), 500

@app.put("/forgotPassword")
def forgot_password():
    try:
        data = request.json
        email = data.get("email")
        new_password = data.get("password")

        users = Users()
        message = users.job_seeker_forgot_password(email, new_password)

        return jsonify({"message": message}), 200
    except KeyError as e:
        return jsonify({"error": f"Missing key: {e}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.post("/jobSeekerLogin")
def login():
    try:
        data = request.json
        email = data.get("email")
        password = data.get("password")

        users = Users()
        message = users.job_seeker_login(email, password)

        return jsonify({"message": message}), 200
    except KeyError as e:
        return jsonify({"error": f"Missing key: {e}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.get("/allJobSeekers")
def get_all_job_seekers():
    try:
        users = Users()
        job_seekers = users.get_job_seekers()

        return jsonify(job_seekers), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.put("/updateJobSeekerDetails")
def update_details():
    try:
        email = request.json["email"]
        skills = request.json["skills"]
        experience = request.json["experience"]
        image = request.json["image"]
        jobRole = request.json["jobRole"]
        major = request.json["skills"]["major"]
        minors = request.json["skills"].get("minors", [])
        current_ctc = request.json["current_ctc"]
        expected_ctc = request.json["expected_ctc"]
        linkedin = request.json["linkedin"]
        github = request.json["github"]
        social_media = request.json["social_media"]
        job_freelance = request.json["job_freelance"]
        
        
        users = Users()
        message = users.update_job_seeker_details(email, major, minors, experience, image, jobRole, current_ctc, expected_ctc,linkedin,github,portal,link,job_freelance)

        return jsonify({"message": message}), 200
    except KeyError as e:
        return jsonify({"error": f"Missing key: {e}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)



# from flask import Flask, jsonify, request
# from database import Users
# from flask_cors import CORS

# app = Flask(__name__)
# CORS(app)

# @app.post("/jobSeekerRegistration")
# def registration():
#         name = request.json["name"]
#         email = request.json["email"]
#         mobile = request.json["mobile"]
#         password = request.json["password"]
#         dob = request.json["dob"]
#         gender = request.json["gender"]
#         skills = request.json["skills"]
#         experience = request.json["experience"]
#         image = request.json["image"]
#         jobRole = request.json["jobRole"]
#         major = request.json["skills"]["major"]
#         minors = request.json["skills"].get("minors", [])
#         current_ctc = request.json["current_ctc"]
#         expected_ctc = request.json["expected_ctc"]
        
#         users = Users()
#         message = users.add_job_seeker(name, email, mobile, password, dob, gender, major, minors, experience, image, jobRole, current_ctc, expected_ctc)
        
#         return jsonify({"message": message}), 200

# @app.put("/forgotPassword")
# def forgot_password():

#         email = request.json["email"]
#         new_password = request.json["password"]
        
#         users = Users()
#         message = users.job_seeker_forgot_password(email, new_password)
        
#         return jsonify({"message": message}), 200

# @app.post("/jobSeekerLogin")
# def login():

#         email = request.json["email"]
#         password = request.json["password"]
        
#         users = Users()
#         message = users.job_seeker_login(email, password)
        
#         return jsonify({"message": message}), 200

# @app.get("/allJobSeekers")
# def get_all_job_seekers():
#     try:
#         users = Users()
#         job_seekers = users.get_job_seekers()
        
#         return jsonify(job_seekers), 200
#     except Exception as e:
#         return jsonify({"error": str(e)}), 400

# @app.put("/updateJobSeekerDetails")
# def update_details():

#         email = request.json["email"]
#         major = request.json["skills"]["major"]
#         minors = request.json["skills"].get("minors", [])
#         experience = request.json["experience"]
#         image = request.json["image"]
#         jobRole = request.json["jobRole"]
#         current_ctc = request.json["current_ctc"]
#         expected_ctc = request.json["expected_ctc"]
        
#         users = Users()
#         message = users.update_job_seeker_details(email, major, minors, experience, image, jobRole, current_ctc, expected_ctc)
        
#         return jsonify({"message": message}), 200

# app.run()
