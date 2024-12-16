"use client";
import { Badge, Button, Card, Indicator, Tabs } from "react-daisyui";
import { useState } from "react";

const plans = [
  {
    id: 1,
    name: "Free Trial",
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "No credit card required. Great for starting out.",
    features: ["Full-featured block editor", "100 AI summaries starter pack", "Single publication"],
    ctaLink: "/auth/register",
    ctaText: "Start for Free",
    popular: false,
  },
  {
    id: 2,
    name: "Pro",
    monthlyPrice: 29,
    yearlyPrice: 19,
    description: "Perfect for creators publishing newsletters weekly.",
    features: ["Full-featured block editor", "500 AI summaries/month", "Single publication"],
    ctaLink: "/auth/register",
    ctaText: "Get Pro Access",
    popular: true,
  },
  {
    id: 3,
    name: "Ultimate",
    monthlyPrice: 169,
    yearlyPrice: 99,
    description: "Designed for professionals managing daily publications.",
    features: ["Full-featured block editor", "Unlimited AI summaries", "Multiple publications", "24/7 support"],
    ctaLink: "/auth/register",
    ctaText: "Get Ultimate Access",
    popular: false,
  },
];

export const Pricing = ({ session }) => {
  const [pricingDuration, setPricingDuration] = useState("yearly");
  
  // checkout handler
  // Checkout handler
  const handleCheckout = async (plan) => {

    console.log(
      {
        duration: pricingDuration,
        plan: plan.name.toLowerCase(),
      }
    )
    if(!session){
      window.location.href = plan.ctaLink;
      return;
    }
    // free trial redirection
    if (plan.name.toLowerCase() === "free trial") {
      // Redirect to the Free Trial registration page
      window.location.href =plan.ctaLink;
      return;
    }

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          duration: pricingDuration,
          plan: plan.name.toLowerCase(),
        }),
      });
      
      

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Something went wrong");
      }

      const { url , message} = await response.json();
      if(message){
        window.alert(message);
        return;
      }
      if (url) {
        window.location.href = url; // Redirect to Stripe checkout session
      }
    } catch (error) {
      console.error("Checkout error:", error.message);
      alert(`Error: ${error.message}`);
    }
  };

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
            {plans.map((plan) => (
              <Card key={plan.id}>
                <Card.Body className="p-3 gap-0">
                  <Card className="bg-base-200 text-base-content">
                    <Card.Body className="p-6 gap-0">
                      <div className="flex justify-between">
                        <h3
                          className={`text-xl font-semibold ${plan.popular ? "text-primary" : ""
                            }`}
                        >
                          {plan.name}
                        </h3>
                        {plan.popular && (
                          <Badge variant="outline" className="font-medium">
                            Most Popular
                          </Badge>
                        )}
                      </div>
                      <p className="mt-4 flex items-baseline">
                        <span
                          className={`text-5xl font-bold tracking-tight ${plan.popular ? "text-primary" : ""
                            }`}
                        >
                          ${
                            pricingDuration === "monthly"
                              ? plan.monthlyPrice
                              : plan.yearlyPrice
                          }
                        </span>
                        <span className="ml-1 text-xl font-semibold">/month</span>
                      </p>
                      <p className="mt-6 text-sm">{plan.description}</p>
                    </Card.Body>
                  </Card>

                  <div className="p-6">
                    <ul
                      className="list-inside list-disc space-y-3 text-base-content text-sm"
                      role="list"
                    >
                      {plan.features.map((feature, index) => (
                        <li key={index}>
                          <span className="ms-3">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button
                   onClick={()=>{
                    handleCheckout(plan);
                   }}
                    className="btn btn-primary btn-outline btn-block mt-auto"
                  >
                    {plan.ctaText}
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
