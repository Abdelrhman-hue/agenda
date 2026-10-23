import { Hero } from "@/components/home/hero";
import { Services } from "@/components/home/services";
import { Features } from "@/components/home/features";
import { Steps } from "@/components/home/steps";
import { AiAssistant } from "@/components/home/ai-assistant";
import { Solutions } from "@/components/home/solutions";
import { Payments } from "@/components/home/payments";
import { Followups } from "@/components/home/followups";
import { Pricing } from "@/components/home/pricing";
import { Faq } from "@/components/home/faq";
import { Cta } from "@/components/home/cta";

export default function Home() {
  return (
    <main>
      <Hero />
      <Services />
      <Features />
      <Steps />
      <AiAssistant />
      <Solutions />
      <Payments />
      <Followups />
      <Pricing />
      <Faq />
      <Cta />
    </main>
  );
}
