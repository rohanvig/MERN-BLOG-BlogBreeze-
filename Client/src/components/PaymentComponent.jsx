import React, { useState, useEffect } from "react";
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

const stripePromise = loadStripe(
import.meta.env.VITE_STRIPE_SECRET_KEY);
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
      console.log("Sending request to create Payment Intent...");
      const response = await axios.post(
        "http://localhost:3000/api/payment/create-payment-intent",
        {
          priceId: priceId,
        },
        { withCredentials: true } // Include credentials (like cookies)
      );
  
      console.log("Payment Intent response:", response.data);
      const clientSecret = response.data.clientSecret;
  
      console.log("Confirming card payment...");
      const { error: stripeError } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );
  
      if (stripeError) {
        console.error("Stripe error:", stripeError);
        setError(stripeError.message);
        setPaymentStatus("failed");
      } else {
        // Payment succeeded
        console.log("Payment succeeded");
        setPaymentStatus("success");
        await axios.post(
          "http://localhost:3000/api/payment/update-subscription",
          {
            premiumSubscription: true,
          },
          { withCredentials: true } // Include credentials (like cookies)
        );
  
        setFormDisabled(true);
        navigate("/premium");
      }
    } catch (error) {
      console.error("Payment failed:", error);
      setError("Payment failed. Please try again.");
      setPaymentStatus("failed");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <>
      <div
        className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-200 to-gray-400 dark:from-gray-800 dark:to-gray-900"
      >
        <div className="max-w-md w-full bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 text-center">
            Complete Your Payment
          </h1>

          {/* Promotional Message */}
          {/* {!userId && (
            <div className="mb-6 p-4 bg-blue-100 text-blue-800 rounded text-center">
            </div>
            )} */}
            <p className="font-semibold text-lg mb-4">
              Enjoy all the premium features! Complete your payment to unlock advanced features and get the most out of our app.
            </p>

          {paymentStatus === "success" && (
            <div className="mb-4 p-4 bg-green-200 text-green-800 rounded">
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
              <div className="relative">
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
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={!stripe || loading || formDisabled}
              className={`w-full py-2 px-4 rounded-lg text-white ${
                stripe && !loading && !formDisabled
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-gray-400"
              }`}
            >
              {loading ? "Processing..." : "Pay Now"}
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
