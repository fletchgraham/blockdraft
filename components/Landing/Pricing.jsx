"use client";
import { Badge, Button, Card, Indicator, Tabs } from "react-daisyui";
import { useState } from "react";

export const Pricing = () => {
  const [pricingDuration, setPricingDuration] = useState("yearly");

  return (
    <>
      <section className="py-8 lg:py-20" id="pricing">
        <div className="container">
          <div className="text-center">
            <h2 className="text-4xl font-semibold">Pricing Plans</h2>
            <p className="mt-2 text-lg">
              Explore flexible pricing that scales with your needs. No hidden
              fees, just transparent options for your success.
            </p>
          </div>
          <div className="mt-6 flex justify-center">
            <Tabs variant="boxed">
              <Tabs.Tab
                active={pricingDuration == "monthly"}
                onClick={() => setPricingDuration("monthly")}
                className="lg:px-10"
              >
                Monthly
              </Tabs.Tab>
              <Tabs.Tab
                active={pricingDuration == "yearly"}
                onClick={() => setPricingDuration("yearly")}
                className={`lg:px-10 ${Indicator.className()} }`}
              >
                Yearly
                <Indicator.Item>
                  <Badge color={"neutral"}>-40%</Badge>
                </Indicator.Item>
              </Tabs.Tab>
            </Tabs>
          </div>
          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            <Card className="">
              <Card.Body className="p-3 gap-0">
                <Card className="bg-base-200 text-base-content">
                  <Card.Body className="p-6 gap-0">
                    <h3 className="text-xl font-semibold">Free</h3>
                    <p className="mt-2 flex items-baseline">
                      <span className="text-5xl font-bold tracking-tight">
                        $0
                      </span>
                      <span className="ml-1 text-xl font-semibold">/month</span>
                    </p>
                    <p className="mt-4 text-sm">
                      Experience essential features at no cost, setting the
                      foundation for your business growth.
                    </p>
                  </Card.Body>
                </Card>

                <div className="p-6">
                  <ul
                    className="list-inside list-disc space-y-3 text-base-content text-sm"
                    role="list"
                  >
                    <li>
                      <span className="ms-3">For Personal Use</span>
                    </li>
                    <li>
                      <span className="ms-3">20 products</span>
                    </li>
                    <li>
                      <span className="ms-3">Limited Integrations</span>
                    </li>
                  </ul>
                </div>
                <Button
                  variant="outline"
                  color="primary"
                  fullWidth
                  className="mt-auto"
                >
                  Start for Free
                </Button>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body className="p-3  gap-0">
                <Card className="bg-base-200  text-base-content">
                  <Card.Body className="p-6 gap-0">
                    <div className="flex justify-between">
                      <h3 className="text-xl font-semibold text-primary">
                        Premium
                      </h3>
                      <Badge variant="outline" className="font-medium">
                        Best Offer
                      </Badge>
                    </div>

                    <p className="mt-4 flex items-baseline">
                      <span className="text-5xl font-bold tracking-tight text-primary">
                        ${pricingDuration == "monthly" ? "99" : "59"}
                      </span>
                      <span className="ml-1 text-xl font-semibold">/month</span>
                    </p>
                    <p className="mt-6 text-sm">
                      Unlock advanced features and elevate your SaaS experience
                      with our premium plan.
                    </p>
                  </Card.Body>
                </Card>
                <div className="p-6">
                  <ul
                    className="list-inside list-disc space-y-3 text-base-content text-sm"
                    role="list"
                  >
                    <li>
                      <span className="ms-3">Up to 10 Team Members</span>
                    </li>
                    <li>
                      <span className="ms-3">Unlocked all Apps</span>
                    </li>
                    <li>
                      <span className="ms-3">Use all Integrations</span>
                    </li>
                    <li>
                      <span className="ms-3">99.9% Support Response Time</span>
                    </li>
                  </ul>
                </div>
                <Button color="primary" fullWidth className="mt-auto">
                  Upgrade to Premium
                </Button>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body className="p-3  gap-0">
                <Card className="bg-base-200">
                  <Card.Body className="p-6  gap-0">
                    <h3 className="text-xl font-semibold">Ultimate</h3>
                    <p className="mt-4 flex items-baseline">
                      <span className="text-5xl font-bold tracking-tight">
                        ${pricingDuration == "monthly" ? "199" : "119"}
                      </span>
                      <span className="ml-1 text-xl font-semibold">/month</span>
                    </p>
                    <p className="mt-6 text-sm">
                      Unleash business potential with our ultimate plan.
                      Maximize features, scalability, and success.
                    </p>
                  </Card.Body>
                </Card>

                <div className="p-6">
                  <ul
                    className="list-inside list-disc space-y-3 text-sm"
                    role="list"
                  >
                    <li>
                      <span className="ms-3">Unlimited Members</span>
                    </li>
                    <li>
                      <span className="ms-3">Unlocked all Apps</span>
                    </li>
                    <li>
                      <span className="ms-3">Use all Integrations</span>
                    </li>
                    <li>
                      <span className="ms-3">24*7 Quick Support</span>
                    </li>
                    <li>
                      <span className="ms-3">Marketing automations</span>
                    </li>
                  </ul>
                </div>
                <Button
                  variant="outline"
                  color="primary"
                  fullWidth
                  className="mt-auto"
                >
                  Get Ultimate Power
                </Button>
              </Card.Body>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
};
