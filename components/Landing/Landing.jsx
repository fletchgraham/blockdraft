import { Hero } from "./Hero.jsx";
import { Feature } from "./Feature.jsx";
import { Integration } from "./Integration.jsx";
import { Pricing } from "./Pricing.jsx";
import { Topbar } from "./Topbar.jsx";
import { FAQ } from "./FAQ.jsx";
import { Footer } from "./Footer.jsx";
import SubscribeModal from "./SubscribeModal.jsx";
import { auth } from "@/auth";

export default async function Landing() {
  const session = await auth();
  

  return (
    <>
      <Topbar session={session} />
      <Hero />
      <Feature />
      <Integration />
      <Pricing session={session} />
      <FAQ />
      <Footer />
      <SubscribeModal />
    </>
  );
}
