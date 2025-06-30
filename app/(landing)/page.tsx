import HeroSection from "../components/sections/HeroSection";
import WhyWeExistSection from "../components/sections/WhyWeExistSection";
import HowItWorksSection from "../components/sections/HowItWorksSection";
import WhatWeOfferSection from "../components/sections/WhatWeOfferSection";
import GlobalImpactSection from "../components/sections/GlobalImpactSection";
import EmpowerCTASection from "../components/sections/EmpowerCTASection";


export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <WhyWeExistSection />
      <HowItWorksSection />
      <WhatWeOfferSection />
      <GlobalImpactSection />
      <EmpowerCTASection />
 
    </div>
  );
}
