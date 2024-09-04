import React, { useState } from "react";
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
import { AiOutlineLoading3Quarters } from "react-icons/ai"; // Loading icon

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_SECRET_KEY);
const priceId = import.meta.env.VITE_PRICE_ID;

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
        "/api/payment/create-payment-intent",
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
          "/api/payment/update-subscription",
          {
            premiumSubscription: true,
          },
          { withCredentials: true }
        );

        setFormDisabled(true);
        navigate("/premium");
      }
    } catch (error) {
      setError("Payment failed. Please try again.");
      setPaymentStatus("failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-slate-600 ">
        <div className="max-w-md w-full bg-white dark:bg-gray-900 p-10 rounded-xl shadow-xl transition-transform transform hover:scale-105">
          <h1 className="text-3xl font-extrabold mb-6 text-gray-900 dark:text-white text-center">
            Complete Your Payment
          </h1>

          <p className="font-semibold text-lg mb-4 text-center text-gray-700 dark:text-gray-300">
            Unlock premium features for just{" "}
            <span className="text-indigo-600 font-bold">Rs. 49</span> per month!
          </p>

          {paymentStatus === "success" && (
            <div className="mb-4 p-4 bg-green-200 text-green-800 rounded animate-bounce">
              Payment was successful!
            </div>
          )}
          {paymentStatus === "failed" && (
            <div className="mb-4 p-4 bg-red-200 text-red-800 rounded">
              Payment failed. Please try again.
            </div>
          )}
          {error && paymentStatus !== "success" && (
            <div className="mb-4 p-4 bg-red-200 text-red-800 rounded">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#424770",
                      "::placeholder": {
                        color: "#aab7c4",
                      },
                    },
                    invalid: {
                      color: "#9e2146",
                    },
                  },
                }}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
              />
            </div>
            <button
              type="submit"
              disabled={!stripe || loading || formDisabled}
              className={`w-full py-3 px-6 rounded-lg font-bold text-white transition duration-300 ease-in-out transform hover:scale-105 ${
                stripe && !loading && !formDisabled
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {loading ? (
                <AiOutlineLoading3Quarters className="animate-spin inline mr-2" />
              ) : (
                "Pay Now"
              )}
            </button>
          </form>
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
