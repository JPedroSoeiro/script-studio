import type { FsNode, NodeId } from "./types";

const APP_TSX = `import { useEffect, useRef, type ReactNode } from "react";

interface Feature {
  icon: string;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: "⚡",
    title: "Bundler instantâneo",
    description:
      "esbuild-wasm compila TypeScript e JSX direto no navegador, sem round-trip para um servidor.",
  },
  {
    icon: "🗂️",
    title: "Sistema de arquivos virtual",
    description:
      "Crie, renomeie e organize arquivos em memória — tudo sincronizado com o editor em tempo real.",
  },
  {
    icon: "🧠",
    title: "IntelliSense de verdade",
    description:
      "Autocomplete, tipos e navegação de código com o mesmo motor do VS Code.",
  },
  {
    icon: "👁️",
    title: "Preview isolado",
    description:
      "Cada build roda em um iframe com sandbox próprio, sem vazar estado entre editor e app.",
  },
];

const STATS: { value: string; label: string }[] = [
  { value: "100%", label: "no navegador" },
  { value: "0", label: "instalações" },
  { value: "<1s", label: "por rebuild" },
  { value: "∞", label: "possibilidades" },
];

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return ref;
}

function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div className="reveal" style={{ transitionDelay: delay + "ms" }} ref={ref}>
      {children}
    </div>
  );
}

function Nav() {
  return (
    <header className="nav">
      <div className="nav-inner">
        <span className="brand">
          <span className="brand-mark">⚡</span> Script Studio
        </span>
        <nav className="nav-links">
          <a href="#recursos">Recursos</a>
          <a href="#numeros">Números</a>
        </nav>
        <button className="btn btn-primary btn-sm">Começar grátis</button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="glow glow-a" aria-hidden="true" />
      <div className="glow glow-b" aria-hidden="true" />

      <span className="eyebrow">Sem instalação. Sem configuração.</span>
      <h1 className="headline">
        Codifique, compile e publique
        <br />
        <span className="gradient-text">sem sair do navegador</span>
      </h1>
      <p className="subheadline">
        Editor Monaco, sistema de arquivos virtual e bundler esbuild trabalhando
        juntos para te dar um ambiente de desenvolvimento completo — instantâneo,
        isolado e 100% client-side.
      </p>

      <div className="hero-actions">
        <button className="btn btn-primary">Abrir editor</button>
        <button className="btn btn-ghost">Ver como funciona →</button>
      </div>

      <div className="pill-row">
        {["React", "TypeScript", "esbuild", "Zero config"].map((tag) => (
          <span className="pill" key={tag}>
            {tag}
          </span>
        ))}
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="recursos" className="section">
      <Reveal>
        <h2 className="section-title">Tudo que um editor precisa</h2>
      </Reveal>
      <div className="grid">
        {FEATURES.map((feature, index) => (
          <Reveal key={feature.title} delay={index * 80}>
            <article className="card">
              <span className="card-icon">{feature.icon}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section id="numeros" className="section stats-section">
      <div className="stats">
        {STATS.map((stat, index) => (
          <Reveal key={stat.label} delay={index * 80}>
            <div className="stat">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function CallToAction() {
  return (
    <section className="section">
      <Reveal>
        <div className="cta">
          <h2>Pronto para escrever a próxima linha?</h2>
          <p>Edite este arquivo agora — as mudanças aparecem aqui do lado em segundos.</p>
          <button className="btn btn-primary">Editar src/App.tsx</button>
        </div>
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <span>Script Studio</span>
      <span>Feito com React + esbuild-wasm</span>
    </footer>
  );
}

export default function App() {
  return (
    <div className="page">
      <Nav />
      <Hero />
      <Features />
      <Stats />
      <CallToAction />
      <Footer />
    </div>
  );
}
`;

const MAIN_TSX = `import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

const container = document.getElementById("root");
if (container) {
  createRoot(container).render(<App />);
}
`;

const STYLES_CSS = `:root {
  --bg: #05060a;
  --bg-soft: #0b0d16;
  --text: #f4f4f6;
  --muted: #9298b0;
  --border: rgba(255, 255, 255, 0.08);
  --accent-a: #7c5cff;
  --accent-b: #38bdf8;
  --radius: 16px;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
}

.page {
  position: relative;
  overflow-x: hidden;
}

/* Nav */
.nav {
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(12px);
  background: rgba(5, 6, 10, 0.72);
  border-bottom: 1px solid var(--border);
}

.nav-inner {
  max-width: 1080px;
  margin: 0 auto;
  padding: 0.9rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.brand {
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  white-space: nowrap;
}

.brand-mark {
  filter: drop-shadow(0 0 6px var(--accent-a));
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-links a {
  color: var(--muted);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s ease;
}

.nav-links a:hover {
  color: var(--text);
}

@media (max-width: 560px) {
  .nav-links {
    display: none;
  }
}

/* Buttons */
.btn {
  border: none;
  border-radius: 999px;
  font-weight: 600;
  cursor: pointer;
  padding: 0.7rem 1.4rem;
  font-size: 0.95rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.btn-sm {
  padding: 0.5rem 1.1rem;
  font-size: 0.85rem;
}

.btn-primary {
  background: linear-gradient(135deg, var(--accent-a), var(--accent-b));
  color: white;
  box-shadow: 0 8px 24px -8px rgba(124, 92, 255, 0.6);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px -8px rgba(124, 92, 255, 0.75);
}

.btn-ghost {
  background: transparent;
  color: var(--text);
  border: 1px solid var(--border);
}

.btn-ghost:hover {
  background: rgba(255, 255, 255, 0.06);
  transform: translateY(-2px);
}

/* Hero */
.hero {
  position: relative;
  max-width: 780px;
  margin: 0 auto;
  padding: clamp(3rem, 8vw, 6rem) 1.5rem 4rem;
  text-align: center;
}

.glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  opacity: 0.35;
  pointer-events: none;
  will-change: transform;
  animation: float 14s ease-in-out infinite;
}

.glow-a {
  width: 320px;
  height: 320px;
  background: var(--accent-a);
  top: -80px;
  left: -60px;
}

.glow-b {
  width: 280px;
  height: 280px;
  background: var(--accent-b);
  top: 40px;
  right: -80px;
  animation-delay: -7s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(20px, 30px) scale(1.08); }
}

.eyebrow {
  display: inline-block;
  font-size: 0.8rem;
  color: var(--accent-b);
  background: rgba(56, 189, 248, 0.1);
  border: 1px solid rgba(56, 189, 248, 0.25);
  padding: 0.3rem 0.8rem;
  border-radius: 999px;
  margin-bottom: 1.5rem;
}

.headline {
  font-size: clamp(1.9rem, 6vw, 3.2rem);
  line-height: 1.15;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0 0 1.2rem;
}

.gradient-text {
  background: linear-gradient(135deg, var(--accent-a), var(--accent-b));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.subheadline {
  color: var(--muted);
  font-size: clamp(0.95rem, 2vw, 1.1rem);
  line-height: 1.6;
  max-width: 560px;
  margin: 0 auto 2rem;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.pill-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

.pill {
  font-size: 0.78rem;
  color: var(--muted);
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 0.3rem 0.75rem;
}

/* Sections */
.section {
  max-width: 1080px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
}

.section-title {
  text-align: center;
  font-size: clamp(1.4rem, 3.5vw, 2rem);
  margin-bottom: 2.5rem;
  font-weight: 700;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
}

.card {
  background: var(--bg-soft);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.5rem;
  transition: transform 0.25s ease, border-color 0.25s ease;
}

.card:hover {
  transform: translateY(-4px);
  border-color: rgba(124, 92, 255, 0.4);
}

.card-icon {
  font-size: 1.6rem;
  display: inline-block;
  margin-bottom: 0.75rem;
}

.card h3 {
  margin: 0 0 0.5rem;
  font-size: 1.05rem;
}

.card p {
  margin: 0;
  color: var(--muted);
  font-size: 0.9rem;
  line-height: 1.55;
}

/* Stats */
.stats-section {
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1.5rem;
  text-align: center;
}

.stat-value {
  display: block;
  font-size: clamp(1.6rem, 4vw, 2.2rem);
  font-weight: 800;
  background: linear-gradient(135deg, var(--accent-a), var(--accent-b));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.stat-label {
  display: block;
  margin-top: 0.35rem;
  color: var(--muted);
  font-size: 0.85rem;
}

/* CTA */
.cta {
  text-align: center;
  background: linear-gradient(135deg, rgba(124, 92, 255, 0.15), rgba(56, 189, 248, 0.15));
  border: 1px solid var(--border);
  border-radius: 24px;
  padding: clamp(2rem, 6vw, 3.5rem) 1.5rem;
}

.cta h2 {
  margin: 0 0 0.6rem;
  font-size: clamp(1.3rem, 3.5vw, 1.9rem);
}

.cta p {
  color: var(--muted);
  margin: 0 0 1.5rem;
}

/* Footer */
.footer {
  max-width: 1080px;
  margin: 0 auto;
  padding: 2rem 1.5rem 3rem;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
  color: var(--muted);
  font-size: 0.85rem;
  border-top: 1px solid var(--border);
}

/* Scroll reveal */
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.reveal.is-visible {
  opacity: 1;
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  .glow {
    animation: none;
  }
  .reveal {
    transition: none;
    opacity: 1;
    transform: none;
  }
}
`;

const PACKAGE_JSON = `{
  "name": "sandbox-project",
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  }
}
`;

export interface DefaultProject {
  nodes: Record<NodeId, FsNode>;
  rootIds: NodeId[];
}

export function createDefaultProject(): DefaultProject {
  const srcId = "folder-src";
  const appId = "file-app";
  const mainId = "file-main";
  const stylesId = "file-styles";
  const packageJsonId = "file-package-json";

  const nodes: Record<NodeId, FsNode> = {
    [srcId]: {
      id: srcId,
      type: "folder",
      name: "src",
      parentId: null,
      childIds: [appId, mainId, stylesId],
    },
    [appId]: {
      id: appId,
      type: "file",
      name: "App.tsx",
      parentId: srcId,
      content: APP_TSX,
    },
    [mainId]: {
      id: mainId,
      type: "file",
      name: "main.tsx",
      parentId: srcId,
      content: MAIN_TSX,
    },
    [stylesId]: {
      id: stylesId,
      type: "file",
      name: "styles.css",
      parentId: srcId,
      content: STYLES_CSS,
    },
    [packageJsonId]: {
      id: packageJsonId,
      type: "file",
      name: "package.json",
      parentId: null,
      content: PACKAGE_JSON,
    },
  };

  return {
    nodes,
    rootIds: [srcId, packageJsonId],
  };
}

export const DEFAULT_ACTIVE_FILE_ID = "file-app";
