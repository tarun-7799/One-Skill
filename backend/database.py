import pyrebase
from firebaseConfig import config

firebase = pyrebase.initialize_app(config)
db = firebase.database()

class Users:
    def __init__(self):
        self.db = db
        
    def get_job_seekers(self):
        users = self.db.child('JobSeekers').get().val() or {}
        return users
    def add_job_seeker(self, name, email, mobile, password, dob, gender, major, minors, experience, image, jobRole, current_ctc, expected_ctc):
    # Check if the email already exists
        users = self.get_job_seekers()
        for user_id, user_data in users.items():
            if user_data["email"] == email:
                return f"{name} with {email} already exists"
    
        # If email doesn't exist, add the user
        if not isinstance(minors, list):
            minors = [minors]
    
        data = {
        "name": name,
        "email": email,
        "mobile": mobile,
        "password": password,
        "dob": dob,
        "gender": gender,
        "skills": {"major": major, "minors": minors},
        "experience": experience,
        "image": image,
        "jobRole": jobRole,
        "current_ctc": current_ctc,
        "expected_ctc": expected_ctc
        }
    
        self.db.child("JobSeekers").push(data)
        return f"{name} added successfully"

    def job_seeker_forgot_password(self, email, new_password):
        users = self.get_job_seekers()
        for user_id, user_data in users.items():
            if user_data["email"] == email:
                self.db.child("JobSeekers").child(user_id).update({"password": new_password})
                return "Password updated successfully"
        return "User not found"

    def job_seeker_login(self, email, password):
        users = self.get_job_seekers()
        for user_id, user_data in users.items():
            if user_data["email"] == email:
                if user_data["password"] == password:
                    return user_id
                else:
                    return "Invalid password"
        return "User not found"

    def update_job_seeker_details(self, email, major, minors, experience, image, jobRole, current_ctc, expected_ctc):
        users = self.get_job_seekers()
        for user_id, user_data in users.items():
            if user_data["email"] == email:
                current_minors = user_data["skills"].get("minors", [])
                if not isinstance(minors, list):
                    minors = [minors]
                updated_minors = list(set(current_minors + minors))
                self.db.child("JobSeekers").child(user_id).update({
                    "skills": {"major": major, "minors": updated_minors},
                    "experience": experience,
                    "jobRole": jobRole,
                    "image": image,
                    "current_ctc": current_ctc,
                    "expected_ctc": expected_ctc
                })
                return "User details updated successfully"
        return "User not found"
