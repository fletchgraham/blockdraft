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

// Helper function to determine usage limit based on price ID
function determineLimit(priceId: string): number {
    if ([process.env.STRIPE_MONTHLY_PRO, process.env.STRIPE_YEARLY_PRO].includes(priceId)) {
        return 500; // Pro Plan
    } else if ([process.env.STRIPE_MONTHLY_ULTIMATE, process.env.STRIPE_YEARLY_ULTIMATE].includes(priceId)) {
        return Infinity; // Ultimate Plan
    }
    return 100; // Default: Free or unknown plan
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
        const eventData = event.data.object as Stripe.Subscription | Stripe.Invoice;

        switch (eventType) {
            case 'customer.subscription.updated':
                await handleSubscriptionUpdate(eventData as Stripe.Subscription);
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

// Combined handler for subscription created/updated
async function handleSubscriptionUpdate(subscription: Stripe.Subscription): Promise<void> {
    console.log(`[Subscription Update] Subscription ID: ${subscription.id}`);
    try {
        const userCollection = await getCollection('users');
        const usageCollection = await getCollection('userUsage');

        const user = await userCollection.findOne({ stripeCustomerId: subscription.customer });
        if (!user) throw new Error(`User not found for Stripe Customer ID: ${subscription.customer}`);

        console.log(`[User Found] User ID: ${user._id}`);

        // Extract the latest price ID
        const priceId = subscription.items?.data?.[0]?.price?.id;
        if (!priceId) throw new Error(`Price ID missing for Subscription ID: ${subscription.id}`);

        // Determine usage limit
        const newLimit = determineLimit(priceId);
        console.log(`[Usage Limit] Set Limit: ${newLimit}`);

        // Update or initialize usage data
        const updateResult = await usageCollection.updateOne(
            { userId: user._id },
            {
                $setOnInsert: {
                    userId: user._id,
                    blocksSummarized: 0,
                    createdAt: new Date()
                },
                $set: {
                    limit: newLimit,
                    updatedAt: new Date()
                },
            },
            { upsert: true }
        );

        if (updateResult.upsertedCount > 0) {
            console.log(`[Usage Initialized] New usage document created for User ID: ${user._id}`);
        } else {
            console.log(`[Usage Updated] Usage document updated for User ID: ${user._id}`);
        }
    } catch (error) {
        console.error(`[Subscription Update] Error: ${error.message}`);
    }
}

// Handle subscription deletion (downgrade to free)
async function handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
    console.log(`[Subscription Deleted] Start processing Subscription ID: ${subscription.id}`);

    try {
        // Step 1: Get database collections
        const userCollection = await getCollection('users');
        const usageCollection = await getCollection('userUsage');
        console.log(`[Database Connected] Retrieved 'users' and 'userUsage' collections.`);

        // Step 2: Find the user by Stripe Customer ID
        console.log(`[Finding User] Searching for user with Stripe Customer ID: ${subscription.customer}`);
        const user = await userCollection.findOne({ stripeCustomerId: subscription.customer });

        if (!user) {
            console.error(`[Error] No user found for Stripe Customer ID: ${subscription.customer}`);
            throw new Error(`User not found for Stripe Customer ID: ${subscription.customer}`);
        }

        console.log(`[User Found] User ID: ${user._id}, Name: ${user.name || 'N/A'}`);

        // Step 3: Prepare free plan limit
        const freePlanLimit = 100; // Free plan limit
        console.log(`[Free Plan] Limit set to ${freePlanLimit}. Downgrading user to Free Plan.`);

        // Step 4: Update or insert user usage data
        const updateResult = await usageCollection.updateOne(
            { userId: user._id },
            {
                $setOnInsert: {
                    userId: user._id,
                    createdAt: new Date()
                },
                $set: {
                    limit: freePlanLimit, // Set limit to free plan
                    updatedAt: new Date()
                },
            },
            { upsert: true }
        );

        // Step 5: Log the result of the update operation
        if (updateResult.matchedCount > 0) {
            console.log(`[Usage Updated] Existing document updated for User ID: ${user._id}`);
        } else if (updateResult.upsertedCount > 0) {
            console.log(`[Usage Inserted] New document created for User ID: ${user._id}`);
        } else {
            console.warn(`[No Update] No document updated or inserted for User ID: ${user._id}`);
        }

        console.log(`[Usage Downgraded] Successfully downgraded User ID: ${user._id} to Free Plan.`);
    } catch (error) {
        console.error(`[Subscription Deleted] Error: ${error.message}`);
        console.error(error);
    }

    console.log(`[Subscription Deleted] Processing completed for Subscription ID: ${subscription.id}`);
}


// Handle subscription payment success (triggered every interval when payment succeeds)
async function handlePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
    console.log(`[Payment Succeeded] Invoice ID: ${invoice.id}`);

    try {
        const userCollection = await getCollection('users');
        const usageCollection = await getCollection('userUsage');

        // Find the user by Stripe customer ID
        const user = await userCollection.findOne({ stripeCustomerId: invoice.customer });
        if (!user) {
            throw new Error(`User not found for Stripe Customer ID: ${invoice.customer}`);
        }

        console.log(`[User Found] User ID: ${user._id}`);

        // Retrieve subscription data to determine the plan
        const subscription = invoice.subscription as string;
        const subscriptionData = await stripe.subscriptions.retrieve(subscription);

        const priceId = subscriptionData.items?.data?.[0]?.price?.id;

        // Determine the usage limit based on the plan
        let limit = 100; // Default for unknown plans
        if ([process.env.STRIPE_MONTHLY_PRO, process.env.STRIPE_YEARLY_PRO].includes(priceId)) {
            limit = 500; // Pro plan limit
        } else if ([process.env.STRIPE_MONTHLY_ULTIMATE, process.env.STRIPE_YEARLY_ULTIMATE].includes(priceId)) {
            limit = Infinity; // Ultimate plan limit
        }

        console.log(`[Subscription Plan] Updated Limit: ${limit}`);

        // Reset blocksSummarized to 0 and update limit
        const updateResult = await usageCollection.updateOne(
            { userId: user._id },
            {
                $set: {
                    limit,                // Update usage limit
                    blocksSummarized: 0,  // Reset usage counter
                    updatedAt: new Date(), // Track the update time
                },
            },
            { upsert: true }
        );

        if (updateResult.matchedCount > 0 || updateResult.upsertedCount > 0) {
            console.log(`[Usage Reset] Successfully reset usage for User ID: ${user._id}`);
        } else {
            console.warn(`[Usage Reset Warning] No document updated for User ID: ${user._id}`);
        }
    } catch (error) {
        console.error(`[Payment Succeeded] Error: ${error.message}`, error);
    }
}


// Handle payment failure
async function handlePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    console.log(`[Payment Failed] Invoice ID: ${invoice.id}`);
    // Optional: Add payment failure handling logic here
    try {
        const userCollection = await getCollection('users');
        const usageCollection = await getCollection('userUsage');

        // Find the user by Stripe customer ID
        const user = await userCollection.findOne({ stripeCustomerId: invoice.customer });
        if (!user) {
            throw new Error(`User not found for Stripe Customer ID: ${invoice.customer}`);
        }

        console.log(`[User Found] User ID: ${user._id}`);

     
        // Determine the usage limit based on the plan
        let limit = 100; // Default for unknown plans
        

        console.log(`[Subscription Plan] Updated Limit: ${limit}`);

        // Reset blocksSummarized to 0 and update limit
        const updateResult = await usageCollection.updateOne(
            { userId: user._id },
            {
                $set: {
                    limit,                // Update usage limit
                    updatedAt: new Date(), // Track the update time
                },
            },
            { upsert: true }
        );

        if (updateResult.matchedCount > 0 || updateResult.upsertedCount > 0) {
            console.log(`[Usage Reset] Successfully reset usage for User ID: ${user._id}`);
        } else {
            console.warn(`[Usage Reset Warning] No document updated for User ID: ${user._id}`);
        }
    } catch (error) {
        console.error(`[Payment Succeeded] Error: ${error.message}`, error);
    }
}
