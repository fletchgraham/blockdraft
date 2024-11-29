"use client";

import mailChimpImage from "@/assets/logo/mailchimp.png";
import substackImage from "@/assets/logo/substack.png";
import beehiivImage from "@/assets/logo/beehiiv.png";
import kitImage from "@/assets/logo/kit.svg";
import linkedinImage from "@/assets/logo/linkedin.png";

import Image from "next/image";

import { Button } from "react-daisyui";

// for the commented out bits
// import { Card } from react-daisyui;
// import { ArrowRight } from "lucide-react";

export const Integration = () => {
  return (
    <section className="py-8 lg:py-20" id="integrations">
      <div className="container">
        <div className="text-center">
          <h2 className="text-4xl font-semibold">Easy Integrations</h2>
          <p className="mt-2 text-lg sm:text-center">
            Keep your existing newsletter platform. BlockDraft integrates with
            them all.
          </p>
        </div>
        <div className="mt-12 rounded-lg bg-base-200 p-8 text-base-content lg:px-24 lg:py-14">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div className="inline-flex flex-col text-center lg:text-start">
              <h3 className="text-3xl font-medium leading-snug">
                Your content, ready for any platform.
              </h3>
              <p className="mt-4 text-lg leading-normal">
                BlockDraft seamlessly copies rich text to your clipboard, ready
                for any platform with a text editor. From newsletters to blogs,
                wherever you publish, BlockDraft fits right in.
              </p>

              <div className="mt-8 flex justify-center lg:justify-start">
                <Button
                  color="primary"
                  onClick={() => {
                    document.getElementById("subscribe_modal").showModal();
                  }}
                >
                  Quick Connect
                </Button>
              </div>
            </div>

            <div className="mt-8 gap-14">
              <div className="flex justify-center lg:justify-end">
                <div className="inline-flex h-16 w-64 mb-4 items-center justify-center rounded-full bg-white shadow">
                  <Image
                    alt="mailchimp"
                    className="w-36"
                    src={mailChimpImage}
                  />
                </div>
              </div>

              <div className="flex justify-center lg:justify-end">
                <div className="inline-flex h-16 w-64 mb-4 items-center justify-center rounded-full bg-white shadow">
                  <Image alt="substack" className="w-36" src={substackImage} />
                </div>
              </div>

              <div className="flex justify-center lg:justify-end">
                <div className="inline-flex h-16 w-64 mb-4 items-center justify-center rounded-full bg-white shadow">
                  <Image alt="openai" className="w-36" src={beehiivImage} />
                </div>
              </div>

              <div className="flex justify-center lg:justify-end">
                <div className="inline-flex h-16 w-64 mb-4 items-center justify-center rounded-full bg-white shadow">
                  <Image alt="meta" className="w-16" src={kitImage} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <Card className="cursor-pointer transition-all hover:shadow">
            <Card.Body className="p-6 gap-0">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-base-200">
                    <Image alt="slack" className="h-8 w-8" src={slackImage} />
                  </div>
                  <h3 className="text-xl font-semibold">Slack</h3>
                </div>
                <Button shape="circle" className="">
                  <ArrowRight className="text-2xl"></ArrowRight>
                </Button>
              </div>
              <p className="mt-4 text-sm">
                Streamline project discussions, share updates, and boost
                real-time collaboration effortlessly.
              </p>
            </Card.Body>
          </Card>

          <Card className="cursor-pointer transition-all hover:shadow">
            <Card.Body className="p-6 gap-0">
              <div className="flex items-center justify-between gap-2 p-0">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-base-200">
                    <Image
                      alt="google drive"
                      className="h-8 w-8"
                      src={gDriveImage}
                    />
                  </div>
                  <h3 className="text-xl font-semibold">Google Drive</h3>
                </div>
                <Button shape="circle" aria-label="Details">
                  <ArrowRight className="text-2xl"></ArrowRight>
                </Button>
              </div>
              <p className="mt-4 text-sm">
                File management, Enhance collaboration, and Elevate your
                productivity with the convenience of this integrated solution
              </p>
            </Card.Body>
          </Card>

          <Card className="cursor-pointer transition-all hover:shadow">
            <Card.Body className="p-6 gap-0">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-base-200">
                    <Image
                      alt="bitbucket"
                      className="h-8 w-8"
                      src={bitBucketImage}
                    />
                  </div>
                  <h3 className="text-xl font-semibold">Bitbucket</h3>
                </div>
                <Button shape="circle" aria-label="Details">
                  <ArrowRight className="text-2xl"></ArrowRight>
                </Button>
              </div>
              <p className="mt-4 text-sm">
                Streamline version control, collaboration, and project
                management with ease. Embrace the power of seamless GitHub
                integration.
              </p>
            </Card.Body>
          </Card>
        </div> */}
      </div>
    </section>
  );
};
