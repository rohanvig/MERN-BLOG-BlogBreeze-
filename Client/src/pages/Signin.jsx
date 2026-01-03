import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill all the fields"));
    }
    try {
      dispatch(signInStart());
      const { data } = await axios.post(
        `${BACKEND_URL}/api/auth/signin`,
        formData,
        { withCredentials: true }
      );
      console.log(data);
      if (data.success === false) {
        dispatch(signInFailure(data.message));
      } else {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
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
                Welcome back! Sign in with your email and password or with
                Google.
              </p>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 p-8 md:p-12 lg:p-16">
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div>
                  <Label value="Your email" />
                  <TextInput
                    type="email"
                    placeholder="name@company.com"
                    id="email"
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label value="Your password" />
                  <TextInput
                    type="password"
                    placeholder="**********"
                    id="password"
                    onChange={handleChange}
                  />
                </div>
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
                    "Sign In"
                  )}
                </Button>
                <OAuth />
              </form>

              <div className="flex gap-2 text-sm mt-5">
                <span>Don't have an account?</span>
                <Link to="/sign-up" className="text-blue-500 hover:underline">
                  Sign Up
                </Link>
              </div>

              <div className="text-sm mt-2">
                <Link
                  to="/forgotpassword"
                  className="text-blue-500 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {errorMessage && !errorMessage.includes("User not found") && (
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
