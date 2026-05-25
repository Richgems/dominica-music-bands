import React from "react";
import HeroSection from "../components/home/HeroSection";
import GenresSection from "../components/home/GenresSection";
import CTASection from "../components/home/CTASection";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <GenresSection />
      <CTASection />
    </div>
  );
}