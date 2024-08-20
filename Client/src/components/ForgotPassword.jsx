import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function ForgotPassword() {
  // State to store the email input by the user
  const [email, setEmail] = useState(""); // Initialize with an empty string

  // State to manage the alert message displayed to the user
  const [alertMessage, setAlertMessage] = useState(""); 

  // Hook to programmatically navigate to different routes
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    try {
      // Make a POST request to the server to request a password reset
      const response = await fetch(
        "http://localhost:3000/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Specify the content type as JSON
          },
          body: JSON.stringify({ email }), // Send the email in the request body
          credentials: "include", // Include credentials such as cookies with the request
        }
      );

      // Parse the JSON response from the server
      const resData = await response.json();

      if (resData.status === "success") {
        // If the response status is "success", show a success message
        setAlertMessage("Reset link sent to your email!");
        // Redirect the user to the sign-in page after a short delay
        setTimeout(() => navigate("/sign-in"), 2000);
      } else {
        // If the response status is not "success", show a failure message
        setAlertMessage("Failed to send reset email. Please try again.");
      }
    } catch (error) {
      // Handle any errors that occur during the fetch request
      console.error("Error:", error);
      setAlertMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-100 h-screen">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm">
        <h4 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          Forgot Password
        </h4>
        {/* Display the alert message if it exists */}
        {alertMessage && (
          <div className="mb-4 text-center text-red-500">
            {alertMessage}
          </div>
        )}
        {/* Form for entering the email address */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-2"
            >
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              autoComplete="off"
              name="email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              onChange={(e) => setEmail(e.target.value)} // Update email state on input change
              required // Ensure the email field is required
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            Send Reset Link
          </button>
        </form>
        <div className="mt-4 text-center">
          {/* Link to navigate back to the sign-in page */}
          <Link to="/sign-in" className="text-blue-500 hover:underline">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
