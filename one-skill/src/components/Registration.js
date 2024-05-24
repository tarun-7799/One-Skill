import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SuccessModal from "./SuccessModal";

const Registration = () => {
  const [currentScreen, setCurrentScreen] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState(null);
  const [experience, setExperience] = useState("");
  const [majorSkill, setMajorSkill] = useState("");
  const [minorSkills, setMinorSkills] = useState([]);
  const [current_ctc, setCurrentCTC] = useState("");
  const [expected_ctc, setExpectedCTC] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [image, setImage] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleAddMinorSkill = (e) => {
    e.preventDefault();
    setMinorSkills([...minorSkills, ""]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedDob = dob ? dob.toLocaleDateString("en-GB") : "";
    const data = {
      name,
      email,
      password,
      mobile: phone,
      dob: formattedDob,
      gender,
      skills: {
        major: majorSkill,
        minors: minorSkills,
      },
      experience,
      jobRole,
      image,
      current_ctc,
      expected_ctc,
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/jobSeekerRegistartion",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const result = await response.json();

      if (response.ok) {
        setMessage(result.message);
        setShowModal(true);
      } else {
        setMessage("Fail to submit: " + result.message);
      }
    } catch (error) {
      setMessage("Failed to submit: " + error.message);
    }
  };

  const renderScreenOne = () => (
    <div>
      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-gray-700 font-semibold mb-2"
        >
          Name:
        </label>
        <input
          type="text"
          id="name"
          className="w-full p-3 border border-gray-300 rounded-lg"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-gray-700 font-semibold mb-2"
        >
          Email:
        </label>
        <input
          type="email"
          id="email"
          className="w-full p-3 border border-gray-300 rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="phone"
          className="block text-gray-700 font-semibold mb-2"
        >
          Phone Number:
        </label>
        <input
          type="tel"
          id="phone"
          className="w-full p-3 border border-gray-300 rounded-lg"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="password"
          className="block text-gray-700 font-semibold mb-2"
        >
          Password:
        </label>
        <input
          type="password"
          id="password"
          className="w-full p-3 border border-gray-300 rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
    </div>
  );

  const renderScreenTwo = () => (
    <div>
      <div className="mb-4">
        <label
          htmlFor="gender"
          className="block text-gray-700 font-semibold mb-2"
        >
          Gender:
        </label>
        <select
          id="gender"
          className="w-full p-3 border border-gray-300 rounded-lg"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
        >
          <option value="">Select</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="dob" className="block text-gray-700 font-semibold mb-2">
          Date of Birth:
        </label>
        <DatePicker
          id="dob"
          className="w-full p-3 border border-gray-300 rounded-lg"
          selected={dob}
          onChange={(date) => setDob(date)}
          dateFormat="dd-MM-yyyy"
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="experience"
          className="block text-gray-700 font-semibold mb-2"
        >
          Experience (years):
        </label>
        <select
          id="experience"
          className="w-full p-3 border border-gray-300 rounded-lg"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          required
        >
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>
      <div className="mb-4">
        <label
          htmlFor="majorSkill"
          className="block text-gray-700 font-semibold mb-2"
        >
          Major Skill:
        </label>
        <input
          type="text"
          id="majorSkill"
          className="w-full p-3 border border-gray-300 rounded-lg"
          value={majorSkill}
          onChange={(e) => setMajorSkill(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">
          Minor Skills:
        </label>
        {minorSkills.map((skill, index) => (
          <input
            key={index}
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg mb-2"
            value={skill}
            onChange={(e) => {
              const updatedSkills = [...minorSkills];
              updatedSkills[index] = e.target.value;
              setMinorSkills(updatedSkills);
            }}
            required
          />
        ))}
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-lg"
          onClick={handleAddMinorSkill}
        >
          Add Minor Skill
        </button>
      </div>
    </div>
  );

  const renderScreenThree = () => (
    <div>
      <div className="mb-4">
        <label
          htmlFor="jobRole"
          className="block text-gray-700 font-semibold mb-2"
        >
          Current job role:
        </label>
        <input
          type="text"
          id="jobRole"
          className="w-full p-3 border border-gray-300 rounded-lg"
          value={jobRole}
          onChange={(e) => setJobRole(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="image"
          className="block text-gray-700 font-semibold mb-2"
        >
          Image:
        </label>
        <input
          type="text"
          id="image"
          className="w-full p-3 border border-gray-300 rounded-lg"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="current_ctc"
          className="block text-gray-700 font-semibold mb-2"
        >
          Current Salary:
        </label>
        <input
          type="number"
          id="current_ctc"
          className="w-full p-3 border border-gray-300 rounded-lg"
          value={current_ctc}
          onChange={(e) => setCurrentCTC(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="expected_ctc"
          className="block text-gray-700 font-semibold mb-2"
        >
          Expected Salary:
        </label>
        <input
          type="number"
          id="expected_ctc"
          className="w-full p-3 border border-gray-300 rounded-lg"
          value={expected_ctc}
          onChange={(e) => setExpectedCTC(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={(e) => setAcknowledged(e.target.checked)}
            required
          />{" "}
          I acknowledge the information provided is correct.
        </label>
      </div>
    </div>
  );
  const closeModal = () => {
    setShowModal(false);
  };
  return (
    <div className="w-100 mx-auto mt-10 p-8 border border-gray-300 rounded-lg shadow-lg bg-lightblue">
      <h2 className="text-3xl font-bold mb-6 text-center">Registration Form</h2>
      {message && <p className="mb-4 text-center text-green-500">{message}</p>}
      <form onSubmit={handleSubmit}>
        {currentScreen === 1 && renderScreenOne()}
        {currentScreen === 2 && renderScreenTwo()}
        {currentScreen === 3 && renderScreenThree()}
        <div className="flex justify-between mt-4">
          {currentScreen > 1 && (
            <button
              type="button"
              className="bg-gray-500 text-white py-2 px-4 rounded-lg"
              onClick={() => setCurrentScreen(currentScreen - 1)}
            >
              Previous
            </button>
          )}
          {currentScreen < 3 ? (
            <button
              type="button"
              className="bg-blue-500 text-white py-2 px-4 rounded-lg"
              onClick={() => setCurrentScreen(currentScreen + 1)}
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="bg-green-500 text-white py-2 px-4 rounded-lg"
              disabled={!acknowledged}
            >
              Register
            </button>
          )}
        </div>
      </form>
      {showModal && <SuccessModal message={message} onClose={closeModal} />}
    </div>
  );
};

export default Registration;
