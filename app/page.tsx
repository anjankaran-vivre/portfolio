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

export default function Page() {
  return (
    <main style={{ position: "relative" }}>
      <div className="pf-grid-backdrop" />
      <Nav />
      <Hero />
      <SystemsSection />
      <LiveDemos />
      <FlowBridge label="SYSTEM FLOW → AGENT LAB" />
      <AgentLab />
      <Projects />
      <FlowBridge label="→ TEAM THREAD" />
      <Team />
      <TechStack />
      <FlowBridge label="→ HOW WE BUILD" />
      <Process />
      <Contact />
      <Footer />
      <SystemStatus />
      <PortfolioAssistant />
    </main>
  );
}