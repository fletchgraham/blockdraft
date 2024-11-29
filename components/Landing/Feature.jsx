"use client";
import draggingImage from "@/assets/landing/dragging.png";
import phonesBeautyImage from "@/assets/landing/bd_phones_beauty_edit.png";
import phoneScreens from "@/assets/landing/bd_mobile_screens.png";
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
          <h2 className="inline text-4xl font-semibold">
            Your Newsletter, Your Way
          </h2>
          <p className="mt-4 text-lg sm:text-center">
            Simplify content creation with blockdraft.ai's intuitive
            drag-and-drop editor and AI-powered insights.
          </p>
        </div>

        <div className="relative z-[2] mt-8 grid gap-8 lg:mt-20 lg:grid-cols-2 lg:gap-12">
          <div className="overflow-hidden rounded-lg bg-base-200 shadow-md transition-all hover:shadow-xl">
            <Image
              alt="Draft Editor Screenshot"
              className="overflow-hidden rounded-ss-lg"
              src={draggingImage}
            />
          </div>

          <div className="lg:mt-8">
            <Badge color="primary">Drag-and-Drop Editor</Badge>
            <h3 className="mt-2 text-3xl font-semibold">
              Effortless Content Assembly
            </h3>
            <p className="mt-2 text-base font-medium">
              A tactile, hands-on editor designed for newsletter creators.
            </p>

            <ul className="mt-4 list-inside list-disc text-base">
              <li>Import URLs to generate blocks with AI summaries</li>
              <li>Organize content blocks effortlessly</li>
              <li>Drag-and-drop interface for an intuitive curation process</li>
              <li>
                Add custom blocks for section headings or original commentary
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:mt-20 lg:grid-cols-2 lg:gap-12">
          <div>
            <Badge color={"primary"}>Efficiency</Badge>
            <h3 className="mt-2 text-3xl font-semibold">
              Lightning-Fast Workflow
            </h3>
            <p className="mt-2 text-base">
              Save hours on curation with AI summaries, quick organization, and
              intuitive tools tailored for daily or weekly publishing.
            </p>

            <ul className="mt-4 list-inside list-disc text-base">
              <li>Automatic summaries of imported links</li>
              <li>Built-in tools for faster content ordering</li>
              <li>Streamlined export to Substack-ready format</li>
              <li>Mobile friendly so you can curate in your spare moments</li>
            </ul>
          </div>

          <div className="order-first lg:order-last">
            <div className="overflow-hidden rounded-lg bg-base-200 shadow-md transition-all hover:shadow-xl">
              <Image
                alt="Workflow Screenshot"
                className="overflow-hidden rounded-ss-lg"
                src={phonesBeautyImage}
              />
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:mt-20 lg:grid-cols-2 lg:gap-12">
          <div className="overflow-hidden rounded-lg bg-base-200 shadow-md transition-all hover:shadow-xl">
            <Image
              alt="Integrations Screenshot"
              className="overflow-hidden rounded-ss-lg"
              src={phoneScreens}
            />
          </div>

          <div className="lg:mt-7">
            <Badge color="primary">Integration</Badge>
            <h3 className="mt-2 text-3xl font-semibold">
              AI-Powered Summaries and Insights
            </h3>
            <p className="mt-2 text-base">
              Powered by ChatGPT, blockdraft.ai creates concise, engaging
              summaries and lets you focus on crafting the perfect newsletter.
            </p>

            <ul className="mt-4 list-inside list-disc text-base">
              <li>Summarize articles with AI</li>
              <li>Integrate seamlessly into your workflow</li>
              <li>Customize your prompt to use for summarizing</li>
              <li>
                Specify if you want bulleted summaries, or a takeaway section
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
