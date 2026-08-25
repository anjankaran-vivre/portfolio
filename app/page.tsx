"use client";

export const dynamic = "force-dynamic";

import { useEffect, useRef } from "react";
import { Nav } from "@/components/navigation/Nav";
import { Hero } from "@/components/hero/Hero";
import { SystemsSection } from "@/components/systems/SystemsSection";
import { LiveDemos } from "@/components/demonstrations/LiveDemos";
import { AgentLab } from "@/components/agent-lab/AgentLab";
import { Projects } from "@/components/projects/Projects";
import { Team } from "@/components/team/Team";
import { TechStack } from "@/components/technology/TechStack";
import { Process } from "@/components/process/Process";
import { Contact, Footer } from "@/components/contact/Contact";
import { PortfolioAssistant } from "@/components/assistant/PortfolioAssistant";
import { SystemStatus } from "@/components/os/SystemStatus";
import { FlowBridge } from "@/components/shared/FlowBridge";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { CaseStudyProvider, useCaseStudy } from "@/lib/case-study-context";
import { PROJECTS } from "@/data/projects";
import { CaseStudy } from "@/components/projects/Projects";
import { scrollToSection } from "@/lib/scroll";

function PageContent() {
  return (
    <>
      <Hero />
      <ScrollReveal>
        <SystemsSection />
      </ScrollReveal>
      <ScrollReveal>
        <LiveDemos />
      </ScrollReveal>
      <FlowBridge label="SYSTEM FLOW → AGENT LAB" />
      <ScrollReveal>
        <AgentLab />
      </ScrollReveal>
      <ScrollReveal>
        <Projects />
      </ScrollReveal>
      <FlowBridge label="→ TEAM THREAD" />
      <ScrollReveal>
        <Team />
      </ScrollReveal>
      <ScrollReveal>
        <TechStack />
      </ScrollReveal>
      <FlowBridge label="→ HOW WE BUILD" />
      <ScrollReveal>
        <Process />
      </ScrollReveal>
      <ScrollReveal>
        <Contact />
      </ScrollReveal>
      <Footer />
      <SystemStatus />
      <PortfolioAssistant />
    </>
  );
}

function CaseStudyView() {
  const { openId } = useCaseStudy();
  const project = PROJECTS.find((p) => p.id === openId);
  if (!project) return null;
  return <CaseStudy p={project} />;
}

function PageInner() {
  const { openId } = useCaseStudy();
  const prevOpenId = useRef<string | null>(null);

  // Closing a case study should land back on the Work section it came
  // from, not the top of the page (PageContent remounts scrolled to 0).
  useEffect(() => {
    if (prevOpenId.current && !openId) {
      requestAnimationFrame(() => scrollToSection("work"));
    }
    prevOpenId.current = openId;
  }, [openId]);

  return (
    <main style={{ position: "relative" }}>
      <div className="pf-grid-backdrop" />
      <Nav />
      {openId ? <CaseStudyView /> : <PageContent />}
    </main>
  );
}

export default function Page() {
  return (
    <CaseStudyProvider>
      <PageInner />
    </CaseStudyProvider>
  );
}