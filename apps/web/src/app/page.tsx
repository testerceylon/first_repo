import { ReviewsSection } from "@/components/reviews";
import { HeroSection } from "@/components/home/hero-section";
import { StatsStrip } from "@/components/home/stats-strip";
import { LatestVideosSection } from "@/components/home/latest-videos";
import { LatestBlogSection } from "@/components/home/latest-blog";
import { CommunitySection } from "@/components/home/community-section";
import { ToolsTeaser } from "@/components/home/tools-teaser";

export default function HomePage() {
  return (
    <main className="bg-[#0a0a0a]">
      <HeroSection />
      <StatsStrip />
      <LatestVideosSection />
      <LatestBlogSection />
      <CommunitySection />
      <ToolsTeaser />
      <ReviewsSection />
    </main>
  );
}
