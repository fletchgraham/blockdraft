"use client";

import { Hero } from "./Hero.jsx";
import { Feature } from "./Feature.jsx";
import { Integration } from "./Integration.jsx";
import { Pricing } from "./Pricing.jsx";
import { Topbar } from "./Topbar.jsx";
import { FAQ } from "./FAQ.jsx";
import { Footer } from "./Footer.jsx";
import SubscribeModal from "./SubscribeModal.jsx";

export default function Landing() {
  return (
    <>
      <Topbar />
      <Hero />
      <Feature />
      <Integration />
      <Pricing />
      <FAQ />
      <Footer />
      <SubscribeModal />
    </>
  );
}
