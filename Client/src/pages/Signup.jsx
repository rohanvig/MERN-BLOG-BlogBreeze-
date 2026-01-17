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
        {/* Back to Home Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-6 group"
        >
          <svg
            className="w-5 h-5 transition-transform group-hover:-translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span className="font-medium">Back to Home</span>
        </Link>

        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left Side - Branding */}
            <div className="flex-1 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-10 md:p-16 text-white flex flex-col justify-center">
              <div className="space-y-6">
                <div>
                  <h1 className="font-bold text-4xl sm:text-5xl mb-2">
                    {!isOtpSent ? "Join Us Today!" : "Almost There!"}
                  </h1>
                  <div className="h-1 w-20 bg-white/40 rounded-full"></div>
                </div>
                <p className="text-lg opacity-90 leading-relaxed">
                  {!isOtpSent
                    ? "Create your account and start your blogging journey with us."
                    : "We've sent a verification code to your email. Please check and enter it below."}
                </p>
                <div className="flex items-center gap-3 pt-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold">BlogBreeze</p>
                    <p className="text-sm opacity-75">Your blogging platform</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 p-8 md:p-12 lg:p-16">
              {!isOtpSent ? (
                <>
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                      Create Account
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">
                      Fill in your details to get started
                    </p>
                  </div>

                  <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                    <div>
                      <Label value="Your username" className="mb-2 block" />
                      <TextInput
                        type="text"
                        placeholder="Username"
                        id="username"
                        onChange={handleChange}
                        icon={() => (
                          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        )}
                      />
                    </div>
                    <div>
                      <Label value="Your email" className="mb-2 block" />
                      <TextInput
                        type="text"
                        placeholder="name@company.com"
                        id="email"
                        onChange={handleChange}
                        icon={() => (
                          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                        )}
                      />
                    </div>
                    <div>
                      <Label value="Your password" className="mb-2 block" />
                      <TextInput
                        type="password"
                        placeholder="••••••••••"
                        id="password"
                        onChange={handleChange}
                        icon={() => (
                          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      />
                    </div>
                    <div>
                      <Label value="Your phone number" className="mb-2 block" />
                      <TextInput
                        type="text"
                        placeholder="+1234567890"
                        id="phoneNumber"
                        onChange={handleChange}
                        icon={() => (
                          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                        )}
                      />
                    </div>
                    <div className="flex justify-center">
                      <ReCAPTCHA
                        sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                        onChange={handleCaptchaChange}
                      />
                    </div>
                    <Button
                      gradientDuoTone="purpleToPink"
                      type="submit"
                      disabled={loading}
                      className="mt-2"
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
                </>
              ) : (
                <>
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                      Verify Your Email
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">
                      We've sent a 6-digit code to <span className="font-semibold">{formData.email}</span>
                    </p>
                  </div>

                  <form
                    className="flex flex-col gap-5"
                    onSubmit={handleOtpSubmit}
                  >
                    <div>
                      <Label value="Enter OTP" className="mb-2 block" />
                      <TextInput
                        type="text"
                        placeholder="123456"
                        id="otp"
                        onChange={handleOtpChange}
                        icon={() => (
                          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      />
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                        Please check your email for the verification code
                      </p>
                    </div>
                    <Button
                      gradientDuoTone="purpleToPink"
                      type="submit"
                      disabled={otpLoading}
                      className="mt-2"
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
                </>
              )}

              <div className="flex gap-2 text-sm mt-6">
                <span className="text-slate-600 dark:text-slate-400">Have an account?</span>
                <Link to="/sign-in" className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                  Sign In
                </Link>
              </div>

              {errorMessage && (
                <Alert className="mt-6" color="failure">
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
