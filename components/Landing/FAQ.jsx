"use client";

import { Collapse } from "react-daisyui";

export const FAQ = () => {
  return (
    <section className="py-8 lg:py-20" id="faq">
      <div className="container">
        <div className="text-center">
          <h2 className="text-4xl font-semibold text-base-content">FAQs</h2>
          <p className="mt-2 text-lg">
            Find solutions, tips, and more to enhance your SaaS experience.
          </p>
        </div>

        <div className="mt-12 flex justify-center gap-6">
          <div className="space-y-4 lg:w-1/2">
            <Collapse className="border border-base-content/10" icon="arrow">
              <Collapse.Title className="text-xl font-medium">
                How does SaaS benefit my business?
              </Collapse.Title>
              <Collapse.Content>
                <p className="text-base">
                  SaaS offers several advantages, including cost-effectiveness,
                  scalability, automatic updates, and accessibility. It allows
                  businesses to focus on core operations while the software
                  provider handles maintenance and updates.
                </p>
              </Collapse.Content>
            </Collapse>

            <Collapse className="border border-base-content/10" icon="arrow">
              <Collapse.Title className="text-xl font-medium">
                What features are included in your SaaS platform?
              </Collapse.Title>
              <Collapse.Content>
                <p className="text-base">
                  Our SaaS platform offers a range of features, including
                  collaborative tools, real-time analytics, integrations with
                  popular applications, user-friendly interfaces, and
                  customizable solutions tailored to your business needs.
                </p>
              </Collapse.Content>
            </Collapse>

            <Collapse className="border border-base-content/10" icon="arrow">
              <Collapse.Title className="text-xl font-medium">
                How can I upgrade my plan?
              </Collapse.Title>
              <Collapse.Content>
                <p className="text-base">
                  Upgrading your plan is easy. Log in to your account, go to the
                  billing section, and choose the plan that suits your business
                  requirements. The upgrade will take effect immediately.
                </p>
              </Collapse.Content>
            </Collapse>

            <Collapse className="border border-base-content/10" icon="arrow">
              <Collapse.Title className="text-xl font-medium">
                Is there a trial period for your SaaS platform?
              </Collapse.Title>
              <Collapse.Content>
                <p className="text-base">
                  Yes, we offer a free trial period for you to explore and
                  experience our platform's features. No credit card is required
                  during the trial period.
                </p>
              </Collapse.Content>
            </Collapse>

            <Collapse className="border border-base-content/10" icon="arrow">
              <Collapse.Title className="text-xl font-medium">
                How is data security handled on your platform?
              </Collapse.Title>
              <Collapse.Content>
                <p className="text-base">
                  We prioritize data security. Our platform employs encryption,
                  access controls, and regular security audits to safeguard your
                  data. We comply with industry standards to ensure your
                  information is secure.
                </p>
              </Collapse.Content>
            </Collapse>
          </div>
        </div>
      </div>
    </section>
  );
};
