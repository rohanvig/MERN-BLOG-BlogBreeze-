import User from "../models/user.model.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export const Payment = async (req, res) => {
  const { priceId } = req.body;
  const userId = req.user.id;
  console.log(userId);

  try {
    // Retrieve the price details from Stripe
    const price = await stripe.prices.retrieve(priceId);

    // Extract the amount and currency from the price details
    const amount = price.unit_amount;
    const currency = price.currency;

    // Create a Payment Intent using the retrieved price details
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      payment_method_types: ["card"],
      metadata: { userId: userId }, // Add user ID to metadata
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export const paymentUpdate = async (req, res) => {
  const { premiumSubscription } = req.body;
  const userId = req.user.id;

  if (!premiumSubscription === undefined) {
    return res
      .status(400)
      .json({ message: "User ID and subscription status are required" });
  }
  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update subscription status
    user.premiumSubscription = premiumSubscription;

    // Save the user
    await user.save();

    res
      .status(200)
      .json({ message: "Subscription status updated successfully" });
  } catch (error) {
    console.error("Error updating subscription status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
