"use client";
import amazonMiniImage from "@/assets/logo/amazon-mini.svg";
import slackImage from "@/assets/logo/slack.svg";
import openAiImage from "@/assets/logo/openai.svg";
import metaMiniImage from "@/assets/logo/meta-mini.svg";
import whatsappImage from "@/assets/logo/whatsapp.svg";
import xImage from "@/assets/logo/x.svg";
import gDriveImage from "@/assets/logo/g-drive.svg";
import bitBucketImage from "@/assets/logo/bitbucket-mini.svg";
import { Button, Card } from "react-daisyui";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export const Integration = () => {
  return (
    <section className="py-8 lg:py-20" id="integrations">
      <div className="container">
        <div className="text-center">
          <h2 className="text-4xl font-semibold">Quick Integrations</h2>
          <p className="mt-2 text-lg sm:text-center">
            Effortless Collaboration: Seamlessly integrate tools for unified
            efficiency with our SaaS platform.
          </p>
        </div>
        <div className="mt-12 rounded-lg bg-base-200 p-8 text-base-content lg:px-24 lg:py-14">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div className="inline-flex flex-col text-center lg:text-start">
              <h3 className="text-3xl font-medium leading-snug">
                Effortless expert Saas integrations, just a snap away.
              </h3>
              <p className="mt-4 text-lg leading-normal">
                Elevate efficiency with our SaaS platform's seamless integration
                feature. Connect tools effortlessly for a unified digital
                workspace.
              </p>

              <div className="mt-8 flex justify-center lg:justify-start">
                <Button color="primary">Quick Connect</Button>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-14 md:grid-cols-3">
              <div className="flex justify-center lg:justify-end">
                <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-white shadow">
                  <Image
                    alt="amazon"
                    className="h-12 w-12"
                    src={amazonMiniImage}
                  />
                </div>
              </div>

              <div className="flex justify-center lg:justify-end">
                <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-white shadow">
                  <Image alt="slack" className="h-12 w-12" src={slackImage} />
                </div>
              </div>

              <div className="flex justify-center lg:justify-end">
                <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-white shadow">
                  <Image alt="openai" className="h-12 w-12" src={openAiImage} />
                </div>
              </div>

              <div className="flex justify-center lg:justify-end">
                <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-white shadow">
                  <Image alt="meta" className="h-12 w-12" src={metaMiniImage} />
                </div>
              </div>

              <div className="flex justify-center lg:justify-end">
                <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-white shadow">
                  <Image
                    alt="whatsapp"
                    className="h-12 w-12"
                    src={whatsappImage}
                  />
                </div>
              </div>

              <div className="flex justify-center lg:justify-end">
                <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-white shadow">
                  <Image alt="x" className="h-12 w-12" src={xImage} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
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
        </div>
      </div>
    </section>
  );
};
