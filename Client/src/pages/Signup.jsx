import { useState } from "react";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import ReCAPTCHA from "react-google-recaptcha";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [otpData, setOtpData] = useState({ otp: "" });
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleOtpChange = (e) => {
    setOtpData({ otp: e.target.value.trim() });
  };

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.phoneNumber ||
      !captchaValue
    ) {
      return setErrorMessage(
        "Please fill out all fields and complete the CAPTCHA."
      );
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch(`${BACKEND_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, recaptchaToken: captchaValue }),
      });
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if (res.ok) {
        setIsOtpSent(true);
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otpData.otp) {
      return setErrorMessage("Please enter the OTP.");
    }
    try {
      setOtpLoading(true);
      setErrorMessage(null);
      const res = await fetch(`${BACKEND_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp: otpData.otp }),
      });

      const data = await res.json();

      if (data.success === false) {
        setOtpLoading(false);
        return setErrorMessage(data.message);
      }
      setOtpLoading(false);
      if (res.ok) {
        navigate("/sign-in");
      }
    } catch (error) {
      setErrorMessage(error.message);
      setOtpLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl">
        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left Side - Branding */}
            <div className="flex-1 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-10 md:p-16 text-white flex flex-col justify-center">
              <Link to="/" className="font-bold text-4xl sm:text-5xl">
                <span className="px-4 py-2 bg-white/20 backdrop-blur rounded-xl inline-block">
                  Hi there!!
                </span>
              </Link>
              <p className="text-lg mt-6 opacity-90">
                Join us today! Sign up with your details or with Google.
              </p>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 p-8 md:p-12 lg:p-16">
              {!isOtpSent ? (
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                  <div>
                    <Label value="Your username" />
                    <TextInput
                      type="text"
                      placeholder="Username"
                      id="username"
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label value="Your email" />
                    <TextInput
                      type="text"
                      placeholder="name@company.com"
                      id="email"
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label value="Your password" />
                    <TextInput
                      type="password"
                      placeholder="Password"
                      id="password"
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label value="Your phone number" />
                    <TextInput
                      type="text"
                      placeholder="+1234567890"
                      id="phoneNumber"
                      onChange={handleChange}
                    />
                  </div>
                  <ReCAPTCHA
                    sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                    onChange={handleCaptchaChange}
                  />
                  <Button
                    gradientDuoTone="purpleToPink"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" />
                        <span className="pl-3">Loading...</span>
                      </>
                    ) : (
                      "Sign Up"
                    )}
                  </Button>
                  <OAuth />
                </form>
              ) : (
                <form
                  className="flex flex-col gap-4"
                  onSubmit={handleOtpSubmit}
                >
                  <div>
                    <Label value="Enter OTP" />
                    <TextInput
                      type="text"
                      placeholder="123456"
                      id="otp"
                      onChange={handleOtpChange}
                    />
                  </div>
                  <Button
                    gradientDuoTone="purpleToPink"
                    type="submit"
                    disabled={otpLoading}
                  >
                    {otpLoading ? (
                      <>
                        <Spinner size="sm" />
                        <span className="pl-3">Verifying...</span>
                      </>
                    ) : (
                      "Verify OTP"
                    )}
                  </Button>
                </form>
              )}

              <div className="flex gap-2 text-sm mt-5">
                <span>Have an account?</span>
                <Link to="/sign-in" className="text-blue-500 hover:underline">
                  Sign In
                </Link>
              </div>

              {errorMessage && (
                <Alert className="mt-7" color="failure">
                  {errorMessage}
                </Alert>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
