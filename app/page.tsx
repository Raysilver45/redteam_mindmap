import FeaturedSection from "@/components/FeaturedSection";
import HeroSection from "@/components/HeroSection";
import IntermediateSection from "@/components/IntermediateSection";
import VideoSection from "@/components/VideoSection";


export default function Home() {
  return (
    <div className="min-h-screen bg-background space-y-0">
    <main>
      <HeroSection />
      <VideoSection />
      <IntermediateSection />
      <FeaturedSection />
    </main>
    </div>
  )

}