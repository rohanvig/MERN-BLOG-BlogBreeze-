import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `/api/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
          credentials: "include",
        }
      );

      const resData = await response.json();

      if (resData.status === "success") {
        setAlertMessage("Reset link sent to your email!");
        setTimeout(() => navigate("/sign-in"), 2000);
      } else {
        setAlertMessage("Failed to send reset email. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setAlertMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-100 dark:bg-gray-900 h-screen">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md">
        <h4 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 text-center">
          Forgot Password
        </h4>
        {alertMessage && (
          <div
            className={`mb-6 text-center ${
              alertMessage.includes("Failed")
                ? "text-red-500"
                : "text-green-500"
            }`}
          >
            {alertMessage}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2"
            >
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              autoComplete="off"
              name="email"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-300"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Send Reset Link
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link
            to="/sign-in"
            className="text-blue-500 dark:text-blue-400 hover:underline transition-colors duration-200"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
