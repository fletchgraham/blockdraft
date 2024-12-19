import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getCollection } from '@/lib/db';
import stripe from '@/lib/stripe';

export async function POST(request: NextRequest) {
    // Authenticate the user
    const session = await auth();
    if (!session || !session.user || !session.user.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email;
    let body;

    try {
        body = await request.json();
    } catch (err) {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { duration, plan } = body;

    if (!duration || !plan) {
        return NextResponse.json({
            error: "Missing required fields: duration and plan",
        }, { status: 400 });
    }

    // Determine the price ID based on duration and plan
    const priceIdMap = {
        monthly: {
            pro: process.env.STRIPE_MONTHLY_PRO,
            ultimate: process.env.STRIPE_MONTHLY_ULTIMATE,
        },
        yearly: {
            pro: process.env.STRIPE_YEARLY_PRO,
            ultimate: process.env.STRIPE_YEARLY_ULTIMATE,
        },
    };

    const priceId = priceIdMap[duration]?.[plan.toLowerCase()];

    if (!priceId) {
        return NextResponse.json({
            error: "Invalid plan or duration",
        }, { status: 400 });
    }

    try {
        // Fetch the user's Stripe customer ID from MongoDB
        const userCollection = await getCollection('users');
        const user = await userCollection.findOne({ email: userEmail });

        if (!user || !user.stripeCustomerId) {
            return NextResponse.json({
                error: "User not registered with Stripe",
            }, { status: 404 });
        }

        // Retrieve the user's current subscriptions from Stripe
        const subscriptions = await stripe.subscriptions.list({
            customer: user.stripeCustomerId,
            status: 'all', // Fetch all subscriptions, including past_due
        });

        // Check if the user already has an active, past_due, or marked for cancellation subscription
        const activeSubscription = subscriptions.data.find(sub =>
            sub.status === 'active' ||
            sub.status === 'past_due' ||
            sub.cancel_at_period_end
        );

        if (activeSubscription) {
            // Inform the user that they are already subscribed
            return NextResponse.json({
                message: "You are already subscribed to a plan. Please manage your subscription through the billing portal.",
            });
        }

        // Create a checkout session if no active or canceled subscription is found
        const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'subscription',
            customer: user.stripeCustomerId,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.NEXT_PUBLIC_URL}/edit`,
            cancel_url: `${process.env.NEXT_PUBLIC_URL}/#pricing`,
        });

        return NextResponse.json({ url: checkoutSession.url });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
