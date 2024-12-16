import { NextRequest, NextResponse } from 'next/server';
import { Buffer } from 'buffer';
import Stripe from 'stripe';
import stripe from '@/lib/stripe';
import { getCollection } from '@/lib/db';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

// Utility to parse the request body for webhook validation
async function parseRequestBody(readable: ReadableStream<Uint8Array>): Promise<Buffer> {
    const reader = readable.getReader();
    const chunks: Uint8Array[] = [];

    let result = await reader.read();
    while (!result.done) {
        if (result.value) {
            chunks.push(result.value);
        }
        result = await reader.read();
    }

    return Buffer.concat(chunks);
}

// Main webhook handler
export async function POST(request: NextRequest) {
    try {
        if (!request.body) {
            throw new Error('Request body is null');
        }

        const reqBuffer = await parseRequestBody(request.body);
        const sig = request.headers.get('stripe-signature') as string;

        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(reqBuffer, sig, webhookSecret);
        } catch (err: any) {
            return NextResponse.json({ success: false, message: `Webhook Error: ${err.message}` }, { status: 400 });
        }

        const eventType = event.type;
        const eventData = event.data.object as Stripe.Subscription | Stripe.Invoice | Stripe.Customer;

        switch (eventType) {
            case 'customer.subscription.created':
                await handleSubscriptionCreated(eventData as Stripe.Subscription);
                break;
            case 'customer.subscription.updated':
                await handleSubscriptionUpdated(eventData as Stripe.Subscription);
                break;
            case 'customer.subscription.deleted':
                await handleSubscriptionDeleted(eventData as Stripe.Subscription);
                break;
            case 'invoice.payment_succeeded':
                await handlePaymentSucceeded(eventData as Stripe.Invoice);
                break;
            case 'invoice.payment_failed':
                await handlePaymentFailed(eventData as Stripe.Invoice);
                break;
            default:
                console.log(`Unhandled event type: ${eventType}`);
                break;
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error(`[Webhook Error] ${error.message}`);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// Handle subscription creation
async function handleSubscriptionCreated(subscription: Stripe.Subscription): Promise<void> {
    console.log(`[Subscription Created] Subscription ID: ${subscription.id}`);
    try {
        const userCollection = await getCollection('users');
        const user = await userCollection.findOne({ stripeCustomerId: subscription.customer });

        if (!user) {
            throw new Error(`User not found for Stripe Customer ID: ${subscription.customer}`);
        }

        const usageCollection = await getCollection('userUsage');
        

        // Get the price ID from the subscription
        const priceId = subscription.items.data[0].price.id;

        // Determine the usage limit based on the subscription plan
        let limit = 100; // Default limit (for Free Trial or other plans)
        if (priceId === process.env.STRIPE_MONTHLY_PRO || priceId === process.env.STRIPE_YEARLY_PRO) {
            limit = 500;  // Pro plan limit
        } else if (priceId === process.env.STRIPE_MONTHLY_ULTIMATE || priceId === process.env.STRIPE_YEARLY_ULTIMATE) {
            limit = Infinity;  // Ultimate plan limit (unlimited summaries)
        }

        // Initialize usage for the new subscription
        await usageCollection.updateOne(
            { userId: user._id, },
            {
                $setOnInsert: {
                    blocksSummarized: 0,
                    limit, // Set the dynamic limit based on the subscription plan
                   
                },
            },
            { upsert: true }
        );
    } catch (error) {
        console.error(`[Subscription Created] Error: ${error.message}`);
    }
}

// Handle subscription updates
async function handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
    console.log(`[Subscription Updated] Subscription ID: ${subscription.id}`);
    try {
        const userCollection = await getCollection('users');
        const user = await userCollection.findOne({ stripeCustomerId: subscription.customer });

        if (!user) {
            throw new Error(`User not found for Stripe Customer ID: ${subscription.customer}`);
        }

        const usageCollection = await getCollection('userUsage');
       

        // Get the price ID from the subscription
        const priceId = subscription.items.data[0].price.id;

        // Determine the new usage limit based on the subscription plan
        let newLimit = 100; // Default limit (for Free Trial or other plans)
        if (priceId === process.env.STRIPE_MONTHLY_PRO || priceId === process.env.STRIPE_YEARLY_PRO) {
            newLimit = 500;  // Pro plan limit
        } else if (priceId === process.env.STRIPE_MONTHLY_ULTIMATE || priceId === process.env.STRIPE_YEARLY_ULTIMATE) {
            newLimit = Infinity;  // Ultimate plan limit (unlimited summaries)
        }

        // If the plan has changed, update the limit. Keep the existing blocksSummarized.
        const currentUsage = await usageCollection.findOne({ userId: user._id,  });
        if (currentUsage) {
            await usageCollection.updateOne(
                { userId: user._id,  },
                {
                    $set: {
                        limit: newLimit, // Update the limit based on the new plan
                    },
                }
            );
        }
    } catch (error) {
        console.error(`[Subscription Updated] Error: ${error.message}`);
    }
}

// Handle subscription deletion (cancellation)
async function handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
    console.log(`[Subscription Deleted] Subscription ID: ${subscription.id}`);
    try {
        const userCollection = await getCollection('users');
        const user = await userCollection.findOne({ stripeCustomerId: subscription.customer });

        if (!user) {
            throw new Error(`User not found for Stripe Customer ID: ${subscription.customer}`);
        }

        const usageCollection = await getCollection('userUsage');
        

        const freePlanLimit = 100; // Free plan limit

        // Update the limit and keep existing blocksSummarized data
        const currentUsage = await usageCollection.findOne({ userId: user._id, });
        if (currentUsage) {
            await usageCollection.updateOne(
                { userId: user._id },
                {
                    $set: {
                        limit: freePlanLimit, // Downgrade to Free Plan limit
                    },
                }
            );
        }
    } catch (error) {
        console.error(`[Subscription Deleted] Error: ${error.message}`);
    }
}

// Handle subscription payment success
async function handlePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
    console.log(`[Subscription Payment Succeeded] Invoice ID: ${invoice.id}`);
    try {
        const userCollection = await getCollection('users');
        const user = await userCollection.findOne({ stripeCustomerId: invoice.customer });

        if (!user) {
            throw new Error(`User not found for Stripe Customer ID: ${invoice.customer}`);
        }

        // You can increment usage limit or other billing-related updates here
    } catch (error) {
        console.error(`[Payment Succeeded] Error: ${error.message}`);
    }
}

// Handle payment failure
async function handlePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    console.log(`[Payment Failure] Invoice ID: ${invoice.id}`);
    try {
        const userCollection = await getCollection('users');
        const user = await userCollection.findOne({ stripeCustomerId: invoice.customer });

        if (!user) {
            throw new Error(`User not found for Stripe Customer ID: ${invoice.customer}`);
        }

        const usageCollection = await getCollection('userUsage');


       
        const freePlanLimit = 100; // Free plan limit

        // Update the limit and keep existing blocksSummarized data
        const currentUsage = await usageCollection.findOne({ userId: user._id, });
        if (currentUsage) {
            await usageCollection.updateOne(
                { userId: user._id },
                {
                    $set: {
                        limit: freePlanLimit, // Downgrade to Free Plan limit
                    },
                }
            );
        }

        // Take necessary actions for payment failure (e.g., notify user, pause subscription)
    } catch (error) {
        console.error(`[Payment Failed] Error: ${error.message}`);
    }
}
