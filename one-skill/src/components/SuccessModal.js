import React from "react";
import Lottie from "react-lottie";
import greenTickAnimation from "../assets/animations/greenTick.json"; // Update this path as needed
import existWarningAnimation from "../assets/animations/existWarning.json"; // Update this path as needed

const SuccessModal = ({ message, onClose }) => {
  // Animation options
  const greenTickOptions = {
    loop: false,
    autoplay: true,
    animationData: greenTickAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const blueTickOptions = {
    loop: false,
    autoplay: true,
    animationData: existWarningAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const animationOptions = message.includes("added successfully")
    ? greenTickOptions
    : blueTickOptions;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="flex bg-white px-40 py-20 rounded-lg shadow-lg justify-center items-center flex-col gap-5">
        <Lottie options={animationOptions} height={150} width={150} />

        <h3 className="text-xl font-bold mb-4">{message}</h3>
        <button
          className={` text-white py-2 px-4 rounded-lg ${
            animationOptions === greenTickOptions
              ? "bg-green-500"
              : "bg-gray-500"
          }`}
          onClick={onClose}
        >
          {animationOptions === greenTickOptions ? "Close" : "Reset the form"}
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;

/*
import React from "react";
import Lottie from "react-lottie";
import greenTick from "../assets/animations/greenTick.json"; // Update this path as needed

const SuccessModal = ({ message, onClose }) => {
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: greenTick,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center ">
      <div className="flex bg-white px-40 py-20 rounded-lg shadow-lg justify-center items-center flex-col gap-5">
        <Lottie options={defaultOptions} height={150} width={150} />

        <h3 className="text-xl font-bold mb-4">{message}</h3>
        <button
          className="bg-gray-500 text-white py-2 px-4 rounded-lg "
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
*/
