"use client";
import heroImage from "@/assets/landing/blockdraft_editor.png";
import googleImage from "@/assets/logo/google.svg";
import microsoftImage from "@/assets/logo/microsoft.svg";
import netflixImage from "@/assets/logo/netflix.svg";
import spotifyImage from "@/assets/logo/spotify.svg";
import paypalImage from "@/assets/logo/paypal.svg";
import { Button } from "react-daisyui";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

export const Hero = () => {
  const heroImageRef = useRef(null);

  useEffect(() => {
    let card3dInstance;

    const loadCard3d = async () => {
      try {
        const Card3d = (await import("card3d")).default; // Lazy import
        if (heroImageRef.current) {
          card3dInstance = new Card3d(heroImageRef.current, {
            perspective: 1000,
            fullPageListening: true,
          });
        }
      } catch (error) {
        console.error("Failed to load Card3d:", error);
      }
    };

    loadCard3d();

    return () => {
      if (card3dInstance) {
        card3dInstance.destroy?.(); // Cleanup if needed
      }
    };
  }, []);

  return (
    <section className="py-8 lg:py-20" id="home">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h1 className="text-4xl font-black tracking-tighter lg:text-6xl lg:leading-none">
              Unlock the power of{" "}
              <span className="text-primary">AI-driven </span>
              content creation.
            </h1>
            <p className=" mt-8 text-lg">
              Curate and build your newsletter effortlessly with drag-and-drop
              blocks, AI summaries, and versatile rich-text output. Stay
              organized, save time, and deliver high-quality content to your
              audience.
            </p>
            <div className="mt-16 inline-flex gap-3">
              <Link href="/auth/register" className="btn btn-secondary btn-lg">
                Get Started for Free
              </Link>
            </div>
          </div>

          <div>
            <div
              className="rounded-2xl bg-gradient-to-r from-indigo-200 via-red-200 to-purple-300 p-3"
              ref={heroImageRef}
            >
              <Image
                alt="SaaS"
                id="hero-image"
                className="rounded-lg"
                priority
                src={heroImage}
              />
            </div>
          </div>
        </div>

        {/* <h2 className="mt-12 text-center text-2xl font-semibold text-base-content/60 lg:mt-32">
          Our Customers
        </h2>

        <div className="mt-12 grid grid-cols-2 justify-center gap-8 sm:grid-cols-3 md:grid-cols-5">
          <Image
            className="mx-auto h-8 cursor-pointer grayscale transition-all duration-500 hover:grayscale-0"
            src={googleImage}
            alt="google logo"
          />
          <Image
            className="mx-auto h-6 cursor-pointer grayscale transition-all duration-500 hover:grayscale-0"
            src={microsoftImage}
            alt="microsoft logo"
          />
          <Image
            className="mx-auto hidden h-6 cursor-pointer grayscale transition-all duration-500 hover:grayscale-0 md:inline"
            src={netflixImage}
            alt="netflix logo"
          />
          <Image
            className="mx-auto hidden h-8 cursor-pointer grayscale transition-all duration-500 hover:grayscale-0 md:inline"
            src={spotifyImage}
            alt="spotify logo"
          />
          <Image
            className="mx-auto hidden h-8 cursor-pointer grayscale transition-all duration-500 hover:grayscale-0 sm:inline"
            src={paypalImage}
            alt="paypal logo"
          />
        </div> */}
      </div>
    </section>
  );
};
