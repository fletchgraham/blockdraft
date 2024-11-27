"use client";
import feature1Image from "@/assets/landing/feature-1.png";
import feature2Image from "@/assets/landing/feature-2.png";
import feature3Image from "@/assets/landing/feature-3.png";
import Image from "next/image";
import { Badge } from "react-daisyui";

export const Feature = () => {
  return (
    <section className="relative py-8 lg:py-20" id="features">
      <div className="absolute start-[10%] z-0">
        <div className="pointer-events-none aspect-square w-60 rounded-full bg-gradient-to-r from-primary/10 via-violet-500/10 to-purple-500/10 blur-3xl [transform:translate3d(0,0,0)] lg:w-[600px]"></div>
      </div>

      <div className="container">
        <div className="flex flex-col items-center">
          <h2 className="inline text-4xl font-semibold">Magical Things</h2>

          <p className="mt-4 text-lg sm:text-center">
            Unlock the Full Potential of Your Business with Our SaaS Platform's
            Key Features
          </p>
        </div>

        <div className="relative z-[2] mt-8 grid gap-8 lg:mt-20 lg:grid-cols-2 lg:gap-12">
          <div className="overflow-hidden rounded-lg bg-base-200 shadow-md transition-all hover:shadow-xl">
            <Image
              alt="saas img"
              className="overflow-hidden rounded-ss-lg"
              src={feature1Image}
            />
          </div>

          <div className="lg:mt-8">
            <Badge color="primary">Dashboard</Badge>
            <h3 className="mt-2 text-3xl font-semibold">
              Fully Controlled Panel
            </h3>
            <p className="mt-2 text-base font-medium">
              Elevate control with our dynamic SaaS dashboard—real-time
              insights, intuitive navigation, seamless customization.
            </p>

            <ul className="mt-4 list-inside list-disc text-base">
              <li>Real-Time Data Insights</li>
              <li>Customizable Widgets</li>
              <li>Intuitive User Interface</li>
              <li>Performance Metrics at a Glance</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:mt-20 lg:grid-cols-2 lg:gap-12">
          <div>
            <Badge color={"primary"}>Control</Badge>
            <h3 className="mt-2 text-3xl font-semibold">Managing Entities</h3>
            <p className="mt-2 text-base">
              Our SaaS platform offers seamless management, allowing you to
              effortlessly oversee users, projects, and resources in one
              centralized hub. Gain real-time insights, streamline workflows,
              and optimize resource allocation for unparalleled efficiency.
            </p>

            <ul className="mt-4 list-inside list-disc text-base">
              <li>User-Friendly Tools</li>
              <li>Resource Management</li>
              <li>Task Assignment</li>
              <li>Robust Control</li>
            </ul>
          </div>

          <div className="order-first lg:order-last">
            <div className="overflow-hidden rounded-lg bg-base-200 shadow-md transition-all hover:shadow-xl">
              <Image
                alt="saas img"
                className="overflow-hidden rounded-ss-lg"
                src={feature2Image}
              />
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:mt-20 lg:grid-cols-2 lg:gap-12">
          <div className="overflow-hidden rounded-lg bg-base-200 shadow-md transition-all hover:shadow-xl">
            <Image
              alt="saas img"
              className="overflow-hidden rounded-ss-lg"
              src={feature3Image}
            />
          </div>

          <div className="lg:mt-7">
            <Badge color="primary">Workflows</Badge>
            <h3 className="mt-2 text-3xl font-semibold">
              Seamless Integrations
            </h3>
            <p className="mt-2 text-base">
              Connect key tools seamlessly with our SaaS platform, streamlining
              your processes and boosting productivity. Experience a cohesive
              digital ecosystem that empowers your business for innovation and
              growth.
            </p>

            <ul className="mt-4 list-inside list-disc text-base">
              <li>Real-time chat with Slack</li>
              <li>Engage your customer with Email</li>
              <li>Getting order from Amazon</li>
              <li>Using Ai from OpenAI</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
