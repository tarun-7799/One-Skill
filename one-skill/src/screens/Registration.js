import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SuccessModal from "../components/SuccessModal";
import { useNavigate } from "react-router-dom";

const Registration = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    trigger,
  } = useForm();
  const [currentScreen, setCurrentScreen] = useState(1);

  const [minorSkills, setMinorSkills] = useState([""]);
  const [acknowledged, setAcknowledged] = useState(false);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [otherLinks, setOtherLinks] = useState([{ platform: "", link: "" }]);

  const handleAddMinorSkill = () => {
    setMinorSkills([...minorSkills, ""]);
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  const onSubmit = async (data) => {
    const formattedDob = data.dob ? data.dob.toLocaleDateString("en-GB") : "";
    const requestData = {
      ...data,
      dob: formattedDob,
      mobile: data.mobile.toString(),
      skills: {
        major: data.majorSkill || "",
        minors: data.minorSkills || [""],
      },
      other_links: otherLinks.reduce((acc, link) => {
        if (link.platform && link.link) {
          acc[link.platform] = link.link;
        }
        return acc;
      }, {}),
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/jobSeekerRegistration",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );
      const result = await response.json();

      if (response.ok) {
        setMessage(result.message);
        setShowModal(true);
        navigate("Login");
      } else {
        setMessage("Failed to submit: " + result.message);
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
          className={`w-full p-3 border ${
            errors.name ? "border-red-500" : "border-gray-300"
          } rounded-lg`}
          {...register("name", { required: "Name is required" })}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
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
          className={`w-full p-3 border ${
            errors.email ? "border-red-500" : "border-gray-300"
          } rounded-lg`}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
              message: "Invalid email address",
            },
          })}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
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
          className={`w-full p-3 border ${
            errors.mobile ? "border-red-500" : "border-gray-300"
          } rounded-lg`}
          {...register("mobile", {
            required: "Phone number is required",
            pattern: {
              value: /^\d{10}$/,
              message: "Invalid phone number",
            },
          })}
        />
        {errors.mobile && (
          <p className="text-red-500 text-sm mt-1">{errors.mobile.message}</p>
        )}
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
          className={`w-full p-3 border ${
            errors.password ? "border-red-500" : "border-gray-300"
          } rounded-lg`}
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 5,
              message: "Password must be at least 5 characters long",
            },
          })}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
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
          className={`w-full p-3 border ${
            errors.gender ? "border-red-500" : "border-gray-300"
          } rounded-lg`}
          {...register("gender", { required: "Gender is required" })}
        >
          <option value="">Select</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {errors.gender && (
          <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="dob" className="block text-gray-700 font-semibold mb-2">
          Date of Birth:
        </label>
        <Controller
          control={control}
          name="dob"
          rules={{
            required: "Date of Birth is required",
            validate: (value) => {
              const age = calculateAge(value);
              return (
                (age >= 21 && age <= 30) || "Age must be between 21 and 30"
              );
            },
          }}
          render={({ field }) => (
            <DatePicker
              id="dob"
              className={`w-full p-3 border ${
                errors.dob ? "border-red-500" : "border-gray-300"
              } rounded-lg`}
              selected={field.value}
              onChange={(date) => field.onChange(date)}
              dateFormat="dd-MM-yyyy"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
            />
          )}
        />
        {errors.dob && (
          <p className="text-red-500 text-sm mt-1">{errors.dob.message}</p>
        )}
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
          className={`w-full p-3 border ${
            errors.experience ? "border-red-500" : "border-gray-300"
          } rounded-lg`}
          {...register("experience")}
        >
          <option value="">Select</option>
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
          className={`w-full p-3 border ${
            errors.majorSkill ? "border-red-500" : "border-gray-300"
          } rounded-lg`}
          {...register("majorSkill")}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">
          Minor Skills:
        </label>
        {minorSkills.map((_, index) => (
          <input
            key={index}
            type="text"
            className={`w-full p-3 border ${
              errors.minorSkills && errors.minorSkills[index]
                ? "border-red-500"
                : "border-gray-300"
            } rounded-lg mb-2`}
            {...register(`minorSkills.${index}`)}
          />
        ))}
        <button
          type="button"
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
          Job Role:
        </label>
        <input
          type="text"
          id="jobRole"
          className={`w-full p-3 border ${
            errors.jobRole ? "border-red-500" : "border-gray-300"
          } rounded-lg`}
          {...register("jobRole")}
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
          className={`w-full p-3 border ${
            errors.image ? "border-red-500" : "border-gray-300"
          } rounded-lg`}
          {...register("image")}
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
          type="text"
          id="current_ctc"
          className={`w-full p-3 border ${
            errors.current_ctc ? "border-red-500" : "border-gray-300"
          } rounded-lg`}
          {...register("current_ctc")}
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
          type="text"
          id="expected_ctc"
          className={`w-full p-3 border ${
            errors.expected_ctc ? "border-red-500" : "border-gray-300"
          } rounded-lg`}
          {...register("expected_ctc")}
        />
      </div>
    </div>
  );
  const renderScreenFour = () => (
    <div>
      <div className="mb-4">
        <label
          htmlFor="linkedin"
          className="block text-gray-700 font-semibold mb-2"
        >
          LinkedIn Link:
        </label>
        <input
          type="text"
          id="linkedin"
          className={`w-full p-3 border ${
            errors.linkedin ? "border-red-500" : "border-gray-300"
          } rounded-lg`}
          {...register("linkedin", {
            validate: (value) =>
              !value ||
              /^(https?:\/\/)?([\w\d]+\.)?linkedin\.com\/.*$/.test(value) ||
              "Invalid LinkedIn URL",
          })}
        />
        {errors.linkedin && (
          <p className="text-red-500 text-sm mt-1">{errors.linkedin.message}</p>
        )}
      </div>
      <div className="mb-4">
        <label
          htmlFor="github"
          className="block text-gray-700 font-semibold mb-2"
        >
          GitHub Link:
        </label>
        <input
          type="text"
          id="github"
          className={`w-full p-3 border ${
            errors.github ? "border-red-500" : "border-gray-300"
          } rounded-lg`}
          {...register("github", {
            validate: (value) =>
              !value ||
              /^(https?:\/\/)?(www\.)?github\.com\/.*$/.test(value) ||
              "Invalid GitHub URL",
          })}
        />
        {errors.github && (
          <p className="text-red-500 text-sm mt-1">{errors.github.message}</p>
        )}
      </div>
      <div className="mb-4">
        <label
          htmlFor="other_links"
          className="block text-gray-700 font-semibold mb-2"
        >
          Other Links
        </label>
        {otherLinks.map((link, index) => (
          <div key={index} className="flex mb-2">
            <input
              type="text"
              placeholder="Platform (e.g., insta, fb)"
              className={`w-1/3 p-3 border ${
                errors.other_links && errors.other_links.platform
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-lg mr-2`}
              value={link.platform}
              onChange={(e) =>
                handleLinkChange(index, "platform", e.target.value)
              }
            />
            <input
              type="text"
              placeholder="Link"
              className={`w-2/3 p-3 border ${
                errors.other_links && errors.other_links.link
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-lg`}
              value={link.link}
              onChange={(e) => handleLinkChange(index, "link", e.target.value)}
            />
            {index > 0 && (
              <button
                type="button"
                className="bg-red-500 text-white py-2 px-4 rounded-lg ml-2"
                onClick={() => handleRemoveLink(index)}
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          className="bg-blue-500 text-white py-2 px-4 rounded-lg"
          onClick={handleAddLink}
        >
          Add Link
        </button>
        {errors.other_links && (
          <p className="text-red-500 text-sm mt-1">
            {errors.other_links.platform?.message ||
              errors.other_links.link?.message}
          </p>
        )}
      </div>
      <div className="mb-4">
        <label
          htmlFor="job_freelance"
          className="block text-gray-700 font-semibold mb-2"
        >
          Job / Freelance:
        </label>
        <select
          id="job_freelance"
          className={`w-full p-3 border ${
            errors.job_freelance ? "border-red-500" : "border-gray-300"
          } rounded-lg`}
          {...register("job_freelance")}
        >
          <option value="">Select</option>
          <option value="job">Job</option>
          <option value="freelance">Freelance</option>
        </select>
        {errors.job_freelance && (
          <p className="text-red-500 text-sm mt-1">
            {errors.job_freelance.message}
          </p>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold my-2">
          <input
            type="checkbox"
            onChange={handleAcknowledgmentChange}
            checked={acknowledged}
          />{" "}
          I acknowledge the information provided is correct.
        </label>
      </div>
    </div>
  );

  const closeModal = () => {
    setShowModal(false);
  };
  const handleNext = async () => {
    const valid = await trigger();
    if (valid) {
      setCurrentScreen(currentScreen + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentScreen(currentScreen - 1);
  };
  const handleAddLink = () => {
    setOtherLinks([...otherLinks, { platform: "", link: "" }]);
  };

  const handleRemoveLink = (index) => {
    const updatedLinks = [...otherLinks];
    updatedLinks.splice(index, 1);
    setOtherLinks(updatedLinks);
  };

  const handleLinkChange = (index, key, value) => {
    const updatedLinks = [...otherLinks];
    updatedLinks[index][key] = value;
    setOtherLinks(updatedLinks);
  };
  const handleAcknowledgmentChange = (e) => {
    setAcknowledged(e.target.checked);
  };
  return (
    <div className="w-8/12 mx-auto mt-10 p-8 border border-gray-300 rounded-lg shadow-lg bg-lightblue">
      <h2 className="text-3xl font-bold mb-6 text-center">Registration Form</h2>
      {message && <p className="mb-4 text-center text-green-500">{message}</p>}
      <form onSubmit={handleSubmit(onSubmit)}>
        {currentScreen === 1 && renderScreenOne()}
        {currentScreen === 2 && renderScreenTwo()}
        {currentScreen === 3 && renderScreenThree()}
        {currentScreen === 4 && renderScreenFour()}
        <div className="flex justify-between mt-4">
          {currentScreen === 1 && <div></div>}
          {currentScreen > 1 && (
            <button
              type="button"
              className="bg-gray-500 text-white py-2 px-4 rounded-lg"
              onClick={handlePrevious}
            >
              Previous
            </button>
          )}
          {currentScreen < 4 ? (
            <button
              type="button"
              className="bg-blue-500 text-white py-2 px-4 rounded-lg"
              onClick={handleNext}
            >
              Next
            </button>
          ) : (
            <div className="">
              <button
                type="submit"
                className="bg-green-500 text-white py-2 px-4 rounded-lg"
                disabled={!acknowledged}
              >
                Register
              </button>
            </div>
          )}
        </div>
      </form>

      {showModal && <SuccessModal message={message} onClose={closeModal} />}
    </div>
  );
};

export default Registration;
