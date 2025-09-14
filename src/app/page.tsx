import HeroSection from "@/components/HeroSection";
import FooterSection from "@/components/FooterSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Property Listings */}
      <div className="py-12 px-10 pb-20 md:pb-12">
        <div className="max-w-7xl mx-auto">
          <HeroSection />
        </div>
      </div>
      
      
    </div>
  );
}
