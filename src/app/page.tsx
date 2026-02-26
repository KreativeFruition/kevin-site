import { Hero } from "@/components/sections/Hero";
import { ManifestoBlock } from "@/components/sections/ManifestoBlock";
import { Timeline } from "@/components/sections/Timeline";
import { CreditsWall } from "@/components/sections/CreditsWall";
import { CreativeSkills } from "@/components/sections/CreativeSkills";
import { Contact } from "@/components/sections/Contact";
import { SiteHeader } from "@/components/navigation/SiteHeader";

export default function Home() {
  return (
    <div className="bg-black text-white">
      <SiteHeader />
      <main className="space-y-0">
        <Hero />
        <ManifestoBlock />
        <Timeline />
        <CreditsWall />
        <CreativeSkills />
        <Contact />
      </main>
    </div>
  );
}
