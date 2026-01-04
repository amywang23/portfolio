export const PROJECTS = [
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
    media: { src: "media/nebula.jpg", alt: "NebulaOps preview" },
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
    media: { src: "media/atlas.jpg", alt: "Atlas Billing preview" },
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
    media: { src: "media/quanta.jpg", alt: "Quanta Search preview" },
  },
];