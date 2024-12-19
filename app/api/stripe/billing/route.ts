import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '',);

export async function GET(request: NextRequest) {
   
    const session = await auth();
    console.log(session)
    if (!session || !session.user || !session.user.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email;

    try {
        // Check if the customer exists
        const customers = await stripe.customers.list({
            email: userEmail,
            limit: 1,
        });

        let customer;
        if (customers.data.length > 0) {
            customer = customers.data[0];
        } else {
            // Create a new customer since one doesn't exist
            customer = await stripe.customers.create({
                email: userEmail,
            });
        }

        console.log({c_id:customer?.id});

        // Create a billing portal session
        const portalSession = await stripe.billingPortal.sessions.create({
            customer: customer.id,
            return_url: process.env.NEXT_PUBLIC_URL +'/edit', // Adjust this URL to suit your deployment
        });

        return NextResponse.json({ url: portalSession.url });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
