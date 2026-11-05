import { ContentSection } from "@/components/home/content-section";
import { CtaBand } from "@/components/home/cta-band";
import { Hero } from "@/components/home/hero";
import { ProcessSection } from "@/components/home/process-section";
import { ProductsSection } from "@/components/home/products-section";
import { ServicesSection } from "@/components/home/services-section";
import { UseCasesSection } from "@/components/home/use-cases-section";
import { WorksMarquee } from "@/components/home/works-marquee";

export default function HomePage() {
  return (
    <>
      <Hero />
      <WorksMarquee />
      <ProductsSection />
      <ServicesSection />
      <ProcessSection />
      <UseCasesSection />
      <ContentSection />
      <CtaBand />
    </>
  );
}
