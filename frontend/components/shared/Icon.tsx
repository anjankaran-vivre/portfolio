import {
  Layers, Cpu, Bot, Workflow, Zap, MessageCircle, Server, Network,
  Database, Book, Boxes, GitBranch, Mail, Search, Send, Terminal,
  Radio, Play, RotateCcw, X, MessageSquare, ChevronDown, ArrowRight,
  ArrowUpRight, Circle, Activity, Globe, Shield, Lock, Check, Loader2,
} from "lucide-react";

const MAP: Record<string, typeof Layers> = {
  layers: Layers,
  cpu: Cpu,
  bot: Bot,
  workflow: Workflow,
  zap: Zap,
  message: MessageCircle,
  server: Server,
  network: Network,
  database: Database,
  book: Book,
  boxes: Boxes,
  gitbranch: GitBranch,
  mail: Mail,
  search: Search,
  send: Send,
  terminal: Terminal,
  radio: Radio,
  play: Play,
  rotate: RotateCcw,
  x: X,
  messageSquare: MessageSquare,
  chevronDown: ChevronDown,
  arrowRight: ArrowRight,
  arrowUpRight: ArrowUpRight,
  circle: Circle,
  activity: Activity,
  globe: Globe,
  shield: Shield,
  lock: Lock,
  check: Check,
  loader: Loader2,
};

export function Icon({ name, size = 18, color = "currentColor", strokeWidth = 1.6, style }: {
  name: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
}) {
  const Cmp = MAP[name] ?? Circle;
  return <Cmp size={size} color={color} strokeWidth={strokeWidth} style={style} />;
}