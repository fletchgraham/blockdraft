import stripe from "@/lib/stripe";

export async function createSubscription(customerId, priceId) {
  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      trial_period_days: 7, // Set trial duration
      payment_behavior: "default_incomplete",
      expand: ["latest_invoice.payment_intent"],
    });

    return { subscriptionId: subscription.id };
  } catch (error) {
    console.error("Error creating subscription:", error.message);
    throw new Error(error.message);
  }
}
