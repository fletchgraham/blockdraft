import stripe from "@/lib/stripe";

export async function getPortalLink(stripeCustomerId) {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_URL}/account`, // Redirect after managing subscription
    });

    return { url: session.url };
  } catch (error) {
    console.error("Error creating customer portal session:", error.message);
    throw new Error(error.message);
  }
}
