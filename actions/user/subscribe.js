import stripe from "@/lib/stripe";

export async function subscribeUser(userData) {
  // Save user to your database and create a Stripe customer
  const { email } = userData;

  const customer = await stripe.customers.create({ email });

  // Save stripeCustomerId to your database
  await saveUserToDatabase({ ...userData, stripeCustomerId: customer.id });

  return customer.id;
}
