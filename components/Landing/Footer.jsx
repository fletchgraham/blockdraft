"use client";
import { Badge, Button, Input } from "react-daisyui";
import { Play } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-neutral text-neutral-content" data-theme="dark">
      <div className="grid lg:grid-cols-2">
        <div>
          <div className="md-12 border-y border-e border-white/20 p-8 sm:p-10 md:px-16 xl:px-40 xl:py-16">
            <div className="grid grid-cols-2">
              <p className="text-xl font-semibold">BlockDraft AI</p>
              <p className="text-base">
                Create curated content with an ai-enabled block editor.
              </p>
            </div>
          </div>

          <div className="md-12 border-e border-white/20 p-8 sm:p-10 md:px-16 xl:px-40 xl:py-16">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-2">
              <div className="flex flex-col gap-5">
                <h2 className="text-xl font-medium">Company</h2>
                <div className="space-y-2">
                  <div>
                    <a
                      className="text-base transition-all duration-500 hover:text-primary"
                      href="#"
                    >
                      Landing
                    </a>
                  </div>
                  {/* <div>
                    <a
                      className="text-base transition-all duration-500 hover:text-primary"
                      href="#"
                    >
                      Our Team
                    </a>
                  </div> */}
                  {/* <div>
                    <a
                      className="text-base transition-all duration-500 hover:text-primary"
                      href="#"
                    >
                      Blogs
                    </a>
                  </div> */}
                  <div>
                    <a
                      className="text-base transition-all duration-500 hover:text-primary"
                      href="#faq"
                    >
                      FAQs
                    </a>
                  </div>
                  <div>
                    <a
                      className="text-base transition-all duration-500 hover:text-primary"
                      onClick={() => {
                        document.getElementById("subscribe_modal").showModal();
                      }}
                    >
                      Contact
                    </a>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-5">
                <h2 className="text-xl font-medium">Quick Links</h2>
                <div className="space-y-2">
                  <div>
                    <a
                      className="text-base transition-all duration-500 hover:text-primary"
                      href="#features"
                    >
                      Features
                    </a>
                  </div>
                  <div>
                    <a
                      className="text-base transition-all duration-500 hover:text-primary"
                      href="#pricing"
                    >
                      Pricing
                    </a>
                  </div>
                  {/* <div>
                    <a
                      className="text-base transition-all duration-500 hover:text-primary"
                      href="#"
                    >
                      Products
                    </a>
                  </div> */}
                </div>
              </div>
              {/* <div className="flex flex-col gap-5">
                <h2 className="text-xl font-medium">Connecting</h2>
                <div className="space-y-2">
                  <div>
                    <a
                      className="text-base transition-all duration-500 hover:text-primary"
                      href="#"
                    >
                      Contact Us
                    </a>
                  </div>
                  <div>
                    <a
                      className="text-base transition-all duration-500 hover:text-primary"
                      href="#"
                    >
                      Support
                    </a>
                  </div>
                  <div>
                    <a
                      className="text-base transition-all duration-500 hover:text-primary"
                      href="#"
                    >
                      Newsletter
                    </a>
                  </div>
                  <div>
                    <a
                      className="text-base transition-all duration-500 hover:text-primary"
                      href="#"
                    >
                      Terms & Conditions
                    </a>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>

        <div className="order-first lg:order-last">
          <form className="md-12 border-t border-white/20 p-8 sm:p-10 md:px-16 xl:px-40 xl:py-16">
            <Badge color="ghost">Demo Request</Badge>
            <h2 className="mt-4 text-3xl font-medium">Help to get started?</h2>
            <div className="mt-4 space-y-2">
              <div>
                <div className="form-control w-full lg:max-w-xs">
                  <label className="label" htmlFor="name">
                    <span className="label-text">Full Name</span>
                  </label>
                  <Input
                    autoComplete="name"
                    id="name"
                    className="input input-bordered w-full lg:max-w-xs"
                    placeholder="Name"
                    type="text"
                    pattern="^[a-zA-Z0-9_.-]*$"
                    minLength={1}
                    required
                  />
                </div>
              </div>
              <div>
                <div className="form-control w-full lg:max-w-xs">
                  <label className="label" htmlFor="email">
                    <span className="label-text">Email</span>
                  </label>
                  <Input
                    autoComplete="email"
                    id="email"
                    className="input join-item input-bordered w-full lg:max-w-xs"
                    placeholder="name@site.com"
                    type="email"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <Button color="primary">Book a Demo</Button>
              {/* <Button
                color="ghost"
                className=""
                startIcon={<Play className={"text-xl"} />}
              >
                <span>Video Tour</span>
              </Button> */}
            </div>
          </form>
        </div>
      </div>
    </footer>
  );
};
