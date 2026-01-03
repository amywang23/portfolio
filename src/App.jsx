import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import {
  Github, Linkedin, Mail, ExternalLink, FileText, Search, Moon, Sun,
  Sparkles, Cpu, ShieldCheck, Rocket, Gauge, Code2, Terminal, X
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip
} from "recharts";

const PROFILE = {
  name: "Alex Chen",
  title: "Full-Stack Engineer • Performance + Product",
  location: "NYC • Open to remote",
  tagline:
    "I build fast, reliable, user-obsessed systems—then measure the results like a scientist with a keyboard.",
  email: "alex@example.com",
  links: {
    github: "https://github.com/",
    linkedin: "https://www.linkedin.com/",
    resume: "#",
  },
  highlights: [
    { icon: <Gauge size={18} />, kpi: "−42%", label: "p95 latency via caching + query plans" },
    { icon: <ShieldCheck size={18} />, kpi: "0→1", label: "SOC2-aligned controls + audit trails" },
    { icon: <Cpu size={18} />, kpi: "10M+", label: "events/day processed w/ idempotent pipeline" },
    { icon: <Rocket size={18} />, kpi: "3x", label: "conversion lift via experimentation" },
  ],
};

const PROJECTS = [
  {
    id: "nebula",
    name: "NebulaOps",
    blurb: "Real-time incident copilot with streaming ingestion + LLM triage.",
    tags: ["React", "Node", "Postgres", "Kafka", "LLM", "Observability"],
    impact: [
      "Cut MTTR by 31% by correlating logs/metrics/traces into one timeline.",
      "Built idempotent ingestion with exactly-once-ish semantics + retries.",
      "Added cost guardrails: token budgets, caching, and prompt telemetry.",
    ],
    metrics: { perf: 92, ux: 88, reliability: 95, complexity: 62 },
    links: { demo: "https://example.com", code: "https://github.com/" },
  },
  {
    id: "atlas",
    name: "Atlas Billing",
    blurb: "Usage-based billing engine with auditability and reconciliation.",
    tags: ["TypeScript", "Go", "Stripe", "Postgres", "Redis", "Kubernetes"],
    impact: [
      "Prevented double-charges with ledger model + deterministic replays.",
      "Reconciled 99.97% of invoices automatically via rule engine.",
      "Reduced support tickets 24% with transparent invoice breakdowns.",
    ],
    metrics: { perf: 86, ux: 80, reliability: 97, complexity: 74 },
    links: { demo: "https://example.com", code: "https://github.com/" },
  },
  {
    id: "quanta",
    name: "Quanta Search",
    blurb: "Vector + keyword hybrid search with relevance tuning tools.",
    tags: ["Python", "FastAPI", "Vector DB", "React", "MLOps", "AWS"],
    impact: [
      "Improved NDCG +19% using hybrid retrieval + reranking experiments.",
      "Built offline eval harness with golden sets + regression tracking.",
      "Shipped admin UI for relevance tuning without redeploys.",
    ],
    metrics: { perf: 84, ux: 83, reliability: 90, complexity: 69 },
    links: { demo: "https://example.com", code: "https://github.com/" },
  },
];

const SKILLS = [
  { group: "Frontend", items: ["React", "TypeScript", "Accessibility", "Animations", "Performance"] },
  { group: "Backend", items: ["Node", "Go", "Python", "Postgres", "Redis", "Queues/Streams"] },
  { group: "Infra", items: ["Docker", "K8s", "CI/CD", "Observability", "AWS/GCP"] },
  { group: "Craft", items: ["Testing", "Design docs", "Incident response", "Mentoring"] },
];

function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }

function useHotkeys(handlers) {
  useEffect(() => {
    const onKeyDown = (e) => {
      const key = e.key.toLowerCase();
      const combo = [
        e.ctrlKey ? "ctrl" : null,
        e.metaKey ? "meta" : null,
        e.shiftKey ? "shift" : null,
        e.altKey ? "alt" : null,
        key,
      ].filter(Boolean).join("+");

      if (handlers[combo]) handlers[combo](e);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handlers]);
}

function smoothScrollTo(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Particles() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const pointer = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const DPR = Math.max(1, Math.floor(window.devicePixelRatio || 1));

    let w = 0, h = 0;
    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };

    const N = 90;
    const nodes = Array.from({ length: N }).map(() => ({
      x: Math.random() * 1,
      y: Math.random() * 1,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
      r: 1.2 + Math.random() * 1.9,
    }));

    const tick = () => {
      ctx.clearRect(0, 0, w, h);

      const g = ctx.createRadialGradient(w * 0.2, h * 0.1, 30, w * 0.2, h * 0.1, Math.max(w, h));
      g.addColorStop(0, "rgba(113,72,255,0.18)");
      g.addColorStop(0.55, "rgba(0,255,187,0.07)");
      g.addColorStop(1, "rgba(255,96,151,0.05)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      const px = pointer.current.x;
      const py = pointer.current.y;

      for (const n of nodes) {
        n.x += n.vx / w;
        n.y += n.vy / h;

        if (n.x < -0.05) n.x = 1.05;
        if (n.x > 1.05) n.x = -0.05;
        if (n.y < -0.05) n.y = 1.05;
        if (n.y > 1.05) n.y = -0.05;

        if (pointer.current.active) {
          const dx = (px - n.x * w);
          const dy = (py - n.y * h);
          const dist = Math.sqrt(dx * dx + dy * dy) + 0.001;
          const pull = clamp(140 / dist, 0, 1) * 0.0009;
          n.vx += dx * pull * 0.0008;
          n.vy += dy * pull * 0.0008;
        }

        n.vx *= 0.995;
        n.vy *= 0.995;
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const ax = a.x * w, ay = a.y * h;
          const bx = b.x * w, by = b.y * h;
          const dx = ax - bx, dy = ay - by;
          const d2 = dx * dx + dy * dy;
          const max = 160 * 160;
          if (d2 < max) {
            const alpha = (1 - d2 / max) * 0.25;
            ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(bx, by);
            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        const x = n.x * w, y = n.y * h;
        ctx.fillStyle = "rgba(255,255,255,0.75)";
        ctx.beginPath();
        ctx.arc(x, y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      pointer.current.x = e.clientX - rect.left;
      pointer.current.y = e.clientY - rect.top;
      pointer.current.active = true;
    };
    const onLeave = () => (pointer.current.active = false);

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);
    canvas.addEventListener("touchmove", (e) => {
      if (!e.touches?.[0]) return;
      const rect = canvas.getBoundingClientRect();
      pointer.current.x = e.touches[0].clientX - rect.left;
      pointer.current.y = e.touches[0].clientY - rect.top;
      pointer.current.active = true;
    }, { passive: true });
    canvas.addEventListener("touchend", onLeave);

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: -2 }}>
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block", opacity: 0.9 }}
      />
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(180deg, rgba(0,0,0,0.10), transparent 35%, rgba(0,0,0,0.35))",
        pointerEvents: "none"
      }} />
    </div>
  );
}

function TopBar({ theme, setTheme, onOpenPalette }) {
  return (
    <div style={{
      position: "sticky", top: 0, zIndex: 20,
      backdropFilter: "blur(10px)",
      background: "rgba(0,0,0,0.18)",
      borderBottom: "1px solid var(--border)"
    }}>
      <div className="container" style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 0"
      }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div className="pill" style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Sparkles size={16} />
            <span style={{ fontWeight: 650, letterSpacing: "-0.01em" }}>{PROFILE.name}</span>
          </div>
          <button
            className="pill"
            onClick={onOpenPalette}
            title="Command Palette"
            style={{ display: "flex", gap: 10, alignItems: "center", cursor: "pointer" }}
          >
            <Search size={16} />
            <span className="muted">Navigate</span>
            <span className="kbd">Ctrl/⌘ K</span>
          </button>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <a className="pill" href={PROFILE.links.github} target="_blank" rel="noreferrer" title="GitHub">
            <Github size={16} />
          </a>
          <a className="pill" href={PROFILE.links.linkedin} target="_blank" rel="noreferrer" title="LinkedIn">
            <Linkedin size={16} />
          </a>
          <a className="pill" href={`mailto:${PROFILE.email}`} title="Email">
            <Mail size={16} />
          </a>

          <button
            className="pill"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
            title="Toggle theme"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            <span className="muted" style={{ fontSize: 13 }}>{theme === "dark" ? "Light" : "Dark"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section id="top" style={{ position: "relative", padding: "60px 0 26px 0" }}>
      <Particles />

      <div className="container">
        <div className="grid" style={{ gridTemplateColumns: "1.2fr 0.8fr", alignItems: "start" }}>
          <motion.div
            className="card glow"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ padding: 22 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div className="pill" style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
                <Code2 size={16} />
                <span style={{ fontWeight: 600 }}>{PROFILE.title}</span>
              </div>
              <div className="pill muted">{PROFILE.location}</div>
            </div>

            <div style={{ marginTop: 14 }}>
              <h1 className="h1">
                Shipping <span style={{
                  background: "linear-gradient(90deg, rgba(113,72,255,1), rgba(0,255,187,1), rgba(255,96,151,1))",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent"
                }}>measurable</span> products.
              </h1>
              <p className="muted" style={{ fontSize: 16, lineHeight: 1.55, margin: "12px 0 0 0" }}>
                {PROFILE.tagline}
              </p>
            </div>

            <div className="hr" />

            <div className="grid" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
              {PROFILE.highlights.map((h) => (
                <div key={h.label} className="pill" style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 12,
                    display: "grid", placeItems: "center",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid var(--border)"
                  }}>
                    {h.icon}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 800, letterSpacing: "-0.02em" }}>{h.kpi}</div>
                    <div className="muted" style={{ fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {h.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
              <a className="pill" href="#projects" onClick={(e) => { e.preventDefault(); smoothScrollTo("projects"); }}
                 style={{ display: "inline-flex", gap: 10, alignItems: "center" }}>
                <Rocket size={16} />
                <span style={{ fontWeight: 650 }}>See projects</span>
              </a>
              <a className="pill" href={PROFILE.links.resume} style={{ display: "inline-flex", gap: 10, alignItems: "center" }}>
                <FileText size={16} />
                <span style={{ fontWeight: 650 }}>Resume</span>
                <ExternalLink size={14} className="muted" />
              </a>
              <a className="pill" href={`mailto:${PROFILE.email}`} style={{ display: "inline-flex", gap: 10, alignItems: "center" }}>
                <Mail size={16} />
                <span style={{ fontWeight: 650 }}>Email me</span>
              </a>
            </div>
          </motion.div>

          <motion.div
            className="card"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            style={{ padding: 18 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Terminal size={18} />
              <div style={{ fontWeight: 700 }}>Build log</div>
              <div className="muted" style={{ marginLeft: "auto", fontSize: 13 }}>live-ish</div>
            </div>

            <BuildLog />

            <div className="hr" />

            <div className="muted" style={{ fontSize: 13, lineHeight: 1.5 }}>
              This panel is intentionally “engineer-coded UI”: small details, clear states,
              and subtle motion. Recruiters notice polish even when they don’t know why.
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function BuildLog() {
  const [lines, setLines] = useState([]);
  const seed = useMemo(() => ([
    { level: "info", text: "Bootstrapping repo…", ms: 350 },
    { level: "ok", text: "Running tests (unit + API)…", ms: 700 },
    { level: "ok", text: "p95 latency check: 182ms ✅", ms: 650 },
    { level: "warn", text: "Bundle size watch: 214kb (ok)", ms: 550 },
    { level: "ok", text: "Deploy preview built.", ms: 600 },
    { level: "info", text: "Warming caches…", ms: 520 },
    { level: "ok", text: "Observability hooks attached.", ms: 520 },
  ]), []);

  useEffect(() => {
    let alive = true;
    let i = 0;

    const run = async () => {
      while (alive) {
        const item = seed[i % seed.length];
        await new Promise(r => setTimeout(r, item.ms));
        if (!alive) break;

        setLines(prev => {
          const next = [...prev, { ...item, id: crypto.randomUUID(), t: new Date().toLocaleTimeString() }];
          return next.slice(-7);
        });

        i++;
      }
    };

    run();
    return () => { alive = false; };
  }, [seed]);

  const color = (lvl) => {
    if (lvl === "ok") return "var(--good)";
    if (lvl === "warn") return "var(--warn)";
    return "rgba(255,255,255,0.75)";
  };

  return (
    <div style={{
      marginTop: 10,
      border: "1px solid var(--border)",
      borderRadius: 16,
      padding: 12,
      background: "rgba(0,0,0,0.18)",
      minHeight: 210
    }}>
      <div className="muted" style={{ fontSize: 12, marginBottom: 8 }}>
        <span className="kbd">status</span> streaming events
      </div>
      <div style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace", fontSize: 12, lineHeight: 1.55 }}>
        {lines.map((l) => (
          <div key={l.id} style={{ display: "flex", gap: 10 }}>
            <span className="muted" style={{ width: 82 }}>{l.t}</span>
            <span style={{ color: color(l.level) }}>
              {l.level === "ok" ? "✓" : l.level === "warn" ? "!" : "•"}
            </span>
            <span style={{ flex: 1 }}>{l.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Section({ id, title, subtitle, right }) {
  return (
    <div style={{ display: "flex", alignItems: "end", gap: 10, margin: "22px 0 12px 0" }}>
      <div style={{ flex: 1 }}>
        <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>{subtitle}</div>
        <div className="h2" id={id} style={{ scrollMarginTop: 90 }}>{title}</div>
      </div>
      {right}
    </div>
  );
}

function Projects() {
  const [filter, setFilter] = useState("All");
  const [active, setActive] = useState(null);

  const tags = useMemo(() => {
    const set = new Set();
    PROJECTS.forEach(p => p.tags.forEach(t => set.add(t)));
    return ["All", ...Array.from(set).sort()];
  }, []);

  const shown = useMemo(() => {
    if (filter === "All") return PROJECTS;
    return PROJECTS.filter(p => p.tags.includes(filter));
  }, [filter]);

  return (
    <section id="projects" style={{ padding: "18px 0 10px 0" }}>
      <div className="container">
        <Section
          id="projects-title"
          title="Projects with receipts"
          subtitle="Clickable case studies • draggable cards • filterable tech"
          right={
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
              {tags.slice(0, 9).map(t => (
                <button
                  key={t}
                  className="pill"
                  onClick={() => setFilter(t)}
                  style={{
                    cursor: "pointer",
                    background: t === filter ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.03)"
                  }}
                  title={`Filter by ${t}`}
                >
                  <span style={{ fontWeight: 650 }}>{t}</span>
                </button>
              ))}
            </div>
          }
        />

        <div className="grid" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
          {shown.map((p, idx) => (
            <motion.div
              key={p.id}
              className="card"
              drag
              dragElastic={0.12}
              dragConstraints={{ top: -18, left: -18, right: 18, bottom: 18 }}
              whileHover={{ y: -6 }}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, delay: idx * 0.05 }}
              style={{ padding: 16, cursor: "grab" }}
              onDoubleClick={() => setActive(p)}
              title="Drag me. Double-click for details."
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 16,
                  display: "grid", placeItems: "center",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid var(--border)"
                }}>
                  <Cpu size={18} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 850, letterSpacing: "-0.02em" }}>{p.name}</div>
                  <div className="muted" style={{ fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {p.blurb}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                {p.tags.slice(0, 4).map(t => (
                  <span key={t} className="pill" style={{ padding: "6px 10px", fontSize: 12 }}>
                    {t}
                  </span>
                ))}
              </div>

              <div className="hr" />

              <div className="muted" style={{ fontSize: 12, display: "flex", gap: 8, alignItems: "center" }}>
                <span className="kbd">hint</span>
                <span>Double-click for case study</span>
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
                <a className="pill" href={p.links.demo} target="_blank" rel="noreferrer"
                   style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <ExternalLink size={14} />
                  <span style={{ fontWeight: 650 }}>Demo</span>
                </a>
                <a className="pill" href={p.links.code} target="_blank" rel="noreferrer"
                   style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <Github size={14} />
                  <span style={{ fontWeight: 650 }}>Code</span>
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {active && (
            <ProjectModal project={active} onClose={() => setActive(null)} />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function ProjectModal({ project, onClose }) {
  const scoreData = [
    { k: "Perf", v: project.metrics.perf },
    { k: "UX", v: project.metrics.ux },
    { k: "Reliability", v: project.metrics.reliability },
    { k: "Complexity↓", v: 100 - project.metrics.complexity },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        background: "rgba(0,0,0,0.55)",
        display: "grid", placeItems: "center",
        padding: 16
      }}
      onMouseDown={onClose}
    >
      <motion.div
        className="card"
        initial={{ y: 18, scale: 0.98, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 10, scale: 0.99, opacity: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
        style={{ width: "min(880px, 100%)", padding: 18 }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 46, height: 46, borderRadius: 18,
            display: "grid", placeItems: "center",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid var(--border)"
          }}>
            <Sparkles size={18} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 900, fontSize: 20, letterSpacing: "-0.02em" }}>{project.name}</div>
            <div className="muted" style={{ fontSize: 13 }}>{project.blurb}</div>
          </div>
          <button className="pill" onClick={onClose} style={{ marginLeft: "auto", cursor: "pointer" }} title="Close">
            <X size={16} />
          </button>
        </div>

        <div className="hr" />

        <div className="grid" style={{ gridTemplateColumns: "1.2fr 0.8fr", alignItems: "start" }}>
          <div>
            <div style={{ fontWeight: 800, marginBottom: 8 }}>What I shipped</div>
            <ul style={{ margin: 0, paddingLeft: 18, color: "var(--muted)", lineHeight: 1.55 }}>
              {project.impact.map((x) => <li key={x}>{x}</li>)}
            </ul>

            <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
              {project.tags.map(t => (
                <span key={t} className="pill" style={{ padding: "6px 10px", fontSize: 12 }}>
                  {t}
                </span>
              ))}
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
              <a className="pill" href={project.links.demo} target="_blank" rel="noreferrer"
                 style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <ExternalLink size={14} />
                <span style={{ fontWeight: 650 }}>Open demo</span>
              </a>
              <a className="pill" href={project.links.code} target="_blank" rel="noreferrer"
                 style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <Github size={14} />
                <span style={{ fontWeight: 650 }}>View code</span>
              </a>
            </div>
          </div>

          <div className="card" style={{ padding: 12, background: "rgba(255,255,255,0.03)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Gauge size={16} />
              <div style={{ fontWeight: 800 }}>Signal dashboard</div>
            </div>

            <div style={{ height: 210 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={scoreData} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
                  <XAxis dataKey="k" tick={{ fill: "rgba(255,255,255,0.65)" }} />
                  <YAxis domain={[0, 100]} tick={{ fill: "rgba(255,255,255,0.65)" }} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(0,0,0,0.75)",
                      border: "1px solid rgba(255,255,255,0.14)",
                      borderRadius: 14,
                      color: "white"
                    }}
                  />
                  <Area type="monotone" dataKey="v" strokeWidth={2} fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="muted" style={{ fontSize: 12, lineHeight: 1.5 }}>
              These are sample scores—swap them for real metrics (Core Web Vitals, MTTR, $ saved, etc.).
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SkillsAndTimeline() {
  const timeline = [
    { year: "2025", title: "Senior Engineer", text: "Led reliability + performance initiatives; shipped billing + observability." },
    { year: "2023", title: "Full-Stack Engineer", text: "Owned core UX flows; built experiment platform + data pipelines." },
    { year: "2021", title: "Engineer", text: "Shipped APIs and UI; learned to love tests and fear production." },
  ];

  return (
    <section id="about" style={{ padding: "10px 0 30px 0" }}>
      <div className="container">
        <Section
          id="about-title"
          title="Skills + story"
          subtitle="Readable at a glance • credible on a second pass"
        />

        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <div className="card" style={{ padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Sparkles size={18} />
              <div style={{ fontWeight: 850 }}>Skills map</div>
              <div className="muted" style={{ marginLeft: "auto", fontSize: 13 }}>stack + craft</div>
            </div>
            <div className="hr" />

            <div className="grid" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
              {SKILLS.map(s => (
                <div key={s.group} className="pill" style={{ padding: 12 }}>
                  <div style={{ fontWeight: 850, marginBottom: 8 }}>{s.group}</div>
                  <div className="muted" style={{ display: "flex", flexWrap: "wrap", gap: 8, lineHeight: 1.4 }}>
                    {s.items.map(x => (
                      <span key={x} className="pill" style={{ padding: "6px 10px", fontSize: 12 }}>
                        {x}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Rocket size={18} />
              <div style={{ fontWeight: 850 }}>Timeline</div>
              <div className="muted" style={{ marginLeft: "auto", fontSize: 13 }}>how I leveled up</div>
            </div>
            <div className="hr" />

            <div className="grid">
              {timeline.map((t, i) => (
                <motion.div
                  key={t.year}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.45, delay: i * 0.05 }}
                  className="pill"
                  style={{ padding: 12, display: "flex", gap: 12 }}
                >
                  <div style={{
                    minWidth: 58, height: 34, borderRadius: 12,
                    display: "grid", placeItems: "center",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid var(--border)",
                    fontWeight: 900
                  }}>
                    {t.year}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 850 }}>{t.title}</div>
                    <div className="muted" style={{ fontSize: 13, lineHeight: 1.45 }}>{t.text}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="hr" />
            <div className="muted" style={{ fontSize: 13, lineHeight: 1.5 }}>
              Replace this with your real history. Keep it punchy: role → scope → measurable outcome.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ padding: "22px 0 60px 0" }}>
      <div className="container">
        <div className="card" style={{ padding: 16, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{
              width: 40, height: 40, borderRadius: 16,
              display: "grid", placeItems: "center",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid var(--border)"
            }}>
              <ShieldCheck size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 900, letterSpacing: "-0.02em" }}>Make it yours</div>
              <div className="muted" style={{ fontSize: 13 }}>
                Swap the sample data → add real links → deploy to GitHub Pages.
              </div>
            </div>
          </div>

          <div style={{ marginLeft: "auto", display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a className="pill" href={`mailto:${PROFILE.email}`} style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
              <Mail size={16} />
              <span style={{ fontWeight: 700 }}>Email</span>
            </a>
            <a className="pill" href={PROFILE.links.github} target="_blank" rel="noreferrer" style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
              <Github size={16} />
              <span style={{ fontWeight: 700 }}>GitHub</span>
            </a>
            <a className="pill" href="#top" onClick={(e) => { e.preventDefault(); smoothScrollTo("top"); }}
               style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontWeight: 800 }}>Back to top</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function CommandPalette({ open, onClose }) {
  const [q, setQ] = useState("");
  const inputRef = useRef(null);

  const items = useMemo(() => ([
    { label: "Go to Projects", action: () => smoothScrollTo("projects") },
    { label: "Go to Skills + Story", action: () => smoothScrollTo("about") },
    { label: "Email", action: () => window.location.href = `mailto:${PROFILE.email}` },
    { label: "Open GitHub", action: () => window.open(PROFILE.links.github, "_blank") },
    { label: "Open LinkedIn", action: () => window.open(PROFILE.links.linkedin, "_blank") },
  ]), []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter(i => i.label.toLowerCase().includes(s));
  }, [q, items]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
    if (!open) setQ("");
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed", inset: 0, zIndex: 60,
            background: "rgba(0,0,0,0.55)",
            display: "grid", placeItems: "center", padding: 16
          }}
          onMouseDown={onClose}
        >
          <motion.div
            className="card"
            initial={{ y: 14, scale: 0.99, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 10, scale: 0.99, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            style={{ width: "min(720px, 100%)", padding: 14 }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Search size={18} />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Type to navigate…"
                style={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  color: "var(--text)",
                  fontSize: 16
                }}
              />
              <span className="kbd">Esc</span>
            </div>

            <div className="hr" />

            <div className="grid" style={{ gap: 10 }}>
              {filtered.map((it) => (
                <button
                  key={it.label}
                  className="pill"
                  style={{ cursor: "pointer", textAlign: "left", padding: 12 }}
                  onClick={() => { it.action(); onClose(); }}
                >
                  <div style={{ fontWeight: 800 }}>{it.label}</div>
                  <div className="muted" style={{ fontSize: 13 }}>Run action</div>
                </button>
              ))}
              {filtered.length === 0 && (
                <div className="muted" style={{ padding: 10 }}>No matches.</div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  const [theme, setTheme] = useState("dark");
  const [paletteOpen, setPaletteOpen] = useState(false);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 180, damping: 26 });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useHotkeys({
    "ctrl+k": (e) => { e.preventDefault(); setPaletteOpen(true); },
    "meta+k": (e) => { e.preventDefault(); setPaletteOpen(true); },
    "escape": () => setPaletteOpen(false),
  });

  return (
    <>
      <motion.div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: 3, zIndex: 80,
        background: "linear-gradient(90deg, rgba(113,72,255,1), rgba(0,255,187,1), rgba(255,96,151,1))",
        transformOrigin: "0% 50%",
        scaleX: progress,
        opacity: 0.9
      }} />

      <TopBar
        theme={theme}
        setTheme={setTheme}
        onOpenPalette={() => setPaletteOpen(true)}
      />

      <Hero />
      <Projects />
      <SkillsAndTimeline />
      <Footer />

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  );
}
