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

export default function Page() {
  return (
    <main style={{ position: "relative" }}>
      <div className="pf-grid-backdrop" />
      <Nav />
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
    </main>
  );
}
