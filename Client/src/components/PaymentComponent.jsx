import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";

import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_SECRET_KEY);
const priceId = import.meta.env.VITE_PRICE_ID;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const PaymentForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [formDisabled, setFormDisabled] = useState(false);
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.error("Stripe or Elements is not available.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/payment/create-payment-intent`,
        {
          priceId: priceId,
        },
        { withCredentials: true }
      );

      const clientSecret = response.data.clientSecret;

      const { error: stripeError } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message);
        setPaymentStatus("failed");
      } else {
        setPaymentStatus("success");
        await axios.post(
          `${BACKEND_URL}/api/payment/update-subscription`,
          {
            premiumSubscription: true,
          },
          { withCredentials: true }
        );

        setFormDisabled(true);
        navigate("/premium");
      }
    } catch (error) {
      setError("Payment failed. Please try again." + error.message);
      setPaymentStatus("failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Premium Badge */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 shadow-lg mb-4">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Go Premium</h1>
            <p className="text-gray-300 text-sm">
              Unlock exclusive features and elevate your experience
            </p>
          </div>

          {/* Payment Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
            {/* Pricing Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-6 text-center">
              <div className="text-white">
                <p className="text-sm font-medium uppercase tracking-wide mb-1">
                  Monthly Subscription
                </p>
                <div className="flex items-center justify-center">
                  <span className="text-5xl font-bold">₹49</span>
                  <span className="text-xl ml-2 opacity-80">/month</span>
                </div>
              </div>
            </div>

            {/* Features List */}
            <div className="px-8 py-6 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
              <ul className="space-y-3">
                <li className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                  <svg
                    className="w-5 h-5 text-green-500 mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Unlimited access to all features</span>
                </li>
                <li className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                  <svg
                    className="w-5 h-5 text-green-500 mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Priority customer support</span>
                </li>
                <li className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                  <svg
                    className="w-5 h-5 text-green-500 mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Cancel anytime, no commitment</span>
                </li>
              </ul>
            </div>

            {/* Payment Form */}
            <div className="px-8 py-6">
              {/* Status Messages */}
              {paymentStatus === "success" && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-green-500 mr-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-green-800 dark:text-green-300 font-medium">
                      Payment successful! Redirecting...
                    </p>
                  </div>
                </div>
              )}

              {paymentStatus === "failed" && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-red-500 mr-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-red-800 dark:text-red-300 font-medium">
                      Payment failed. Please try again.
                    </p>
                  </div>
                </div>
              )}

              {error && paymentStatus !== "success" && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-start">
                    <svg
                      className="w-5 h-5 text-red-500 mr-3 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-red-800 dark:text-red-300 text-sm">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Card Details
                  </label>
                  <div className="relative">
                    <CardElement
                      options={{
                        style: {
                          base: {
                            fontSize: "16px",
                            color: "#1f2937",
                            fontFamily: '"Inter", system-ui, sans-serif',
                            "::placeholder": {
                              color: "#9ca3af",
                            },
                            iconColor: "#6366f1",
                          },
                          invalid: {
                            color: "#ef4444",
                            iconColor: "#ef4444",
                          },
                        },
                      }}
                      className="p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white dark:bg-gray-700"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!stripe || loading || formDisabled}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-white text-base transition-all duration-200 ease-in-out transform focus:outline-none focus:ring-4 focus:ring-purple-300 ${
                    stripe && !loading && !formDisabled
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                      : "bg-gray-400 cursor-not-allowed opacity-60"
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <AiOutlineLoading3Quarters className="animate-spin mr-2 text-xl" />
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      Secure Payment
                    </span>
                  )}
                </button>
              </form>

              {/* Security Badge */}
              <div className="mt-6 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
                <svg
                  className="w-4 h-4 mr-1.5 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Secured by Stripe • Your payment information is encrypted
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

const PaymentComponent = () => (
  <Elements stripe={stripePromise}>
    <PaymentForm />
  </Elements>
);

export default PaymentComponent;
