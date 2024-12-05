"use client";
import { Badge, Button, Card, Indicator, Tabs } from "react-daisyui";
import { useState } from "react";
import Link from "next/link";

export const Pricing = () => {
  const [pricingDuration, setPricingDuration] = useState("yearly");

  return (
    <>
      <section className="py-8 lg:py-20" id="pricing">
        <div className="container">
          <div className="text-center">
            <h2 className="text-4xl font-semibold">Pricing Plans</h2>
            <p className="mt-2 text-lg">
              Choose the plan that works best for your publishing goals. Whether
              you're just starting out or managing multiple newsletters, we've
              got you covered.
            </p>
          </div>
          <div className="mt-6 flex justify-center">
            <Tabs variant="boxed">
              <Tabs.Tab
                active={pricingDuration === "monthly"}
                onClick={() => setPricingDuration("monthly")}
                className="lg:px-10"
              >
                Monthly
              </Tabs.Tab>
              <Tabs.Tab
                active={pricingDuration === "yearly"}
                onClick={() => setPricingDuration("yearly")}
                className="lg:px-10"
              >
                Yearly
                <Indicator>
                  <Badge color={"neutral"}>-40%</Badge>
                </Indicator>
              </Tabs.Tab>
            </Tabs>
          </div>
          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            {/* Free Plan */}
            <Card>
              <Card.Body className="p-3 gap-0">
                <Card className="bg-base-200 text-base-content">
                  <Card.Body className="p-6 gap-0">
                    <h3 className="text-xl font-semibold">Free Trial</h3>
                    <p className="mt-2 flex items-baseline">
                      <span className="text-5xl font-bold tracking-tight">
                        $0
                      </span>
                      <span className="ml-1 text-xl font-semibold">/month</span>
                    </p>
                    <p className="mt-4 text-sm">
                      No credit card required. It should last you about a month
                      if you're publishing twice per week.
                    </p>
                  </Card.Body>
                </Card>

                <div className="p-6">
                  <ul
                    className="list-inside list-disc space-y-3 text-base-content text-sm"
                    role="list"
                  >
                    <li>
                      <span className="ms-3">Full-featured block editor</span>
                    </li>
                    <li>
                      <span className="ms-3">
                        100 AI summaries starter pack
                      </span>
                    </li>
                    <li>
                      <span className="ms-3">Single publication</span>
                    </li>
                  </ul>
                </div>
                <Link
                  href="/auth/register"
                  className="btn btn-primary btn-outline btn-block mt-auto"
                >
                  Start for Free
                </Link>
              </Card.Body>
            </Card>

            {/* Premium Plan */}
            <Card>
              <Card.Body className="p-3 gap-0">
                <Card className="bg-base-200 text-base-content">
                  <Card.Body className="p-6 gap-0">
                    <div className="flex justify-between">
                      <h3 className="text-xl font-semibold text-primary">
                        Pro
                      </h3>
                      <Badge variant="outline" className="font-medium">
                        Most Popular
                      </Badge>
                    </div>
                    <p className="mt-4 flex items-baseline">
                      <span className="text-5xl font-bold tracking-tight text-primary">
                        ${pricingDuration === "monthly" ? "29" : "19"}
                      </span>
                      <span className="ml-1 text-xl font-semibold">/month</span>
                    </p>
                    <p className="mt-6 text-sm">
                      Perfect for creators publishing a curated newsletter 2-3
                      times per week.
                    </p>
                  </Card.Body>
                </Card>
                <div className="p-6">
                  <ul
                    className="list-inside list-disc space-y-3 text-base-content text-sm"
                    role="list"
                  >
                    <li>
                      <span className="ms-3">Full-featured block editor</span>
                    </li>
                    <li>
                      <span className="ms-3">500 AI summaries/month</span>
                    </li>
                    <li>
                      <span className="ms-3">Single publication</span>
                    </li>
                  </ul>
                </div>
                <Link
                  href="/auth/register"
                  className="btn btn-primary btn-block mt-auto"
                >
                  Get Pro Access
                </Link>
              </Card.Body>
            </Card>

            {/* Ultimate Plan */}
            <Card>
              <Card.Body className="p-3 gap-0">
                <Card className="bg-base-200 text-base-content">
                  <Card.Body className="p-6 gap-0">
                    <h3 className="text-xl font-semibold">Ultimate</h3>
                    <p className="mt-4 flex items-baseline">
                      <span className="text-5xl font-bold tracking-tight">
                        ${pricingDuration === "monthly" ? "169" : "99"}
                      </span>
                      <span className="ml-1 text-xl font-semibold">/month</span>
                    </p>
                    <p className="mt-6 text-sm">
                      Designed for professionals managing multiple daily
                      publications.
                    </p>
                  </Card.Body>
                </Card>

                <div className="p-6">
                  <ul
                    className="list-inside list-disc space-y-3 text-sm"
                    role="list"
                  >
                    <li>
                      <span className="ms-3">Full-featured block editor</span>
                    </li>
                    <li>
                      <span className="ms-3">Unlimited AI summaries</span>
                    </li>
                    <li>
                      <span className="ms-3">Multiple publications</span>
                    </li>
                    <li>
                      <span className="ms-3">24/7 dedicated support</span>
                    </li>
                  </ul>
                </div>
                <Link
                  href="/auth/register"
                  className="btn btn-primary btn-outline btn-block mt-auto"
                >
                  Get Ultimate Access
                </Link>
              </Card.Body>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
};
