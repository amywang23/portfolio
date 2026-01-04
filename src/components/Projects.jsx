import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PROJECTS } from "../data/projects";
import ProjectModal from "./ProjectModal";

export default function Projects() {
  const [activeId, setActiveId] = useState(PROJECTS[0]?.id);
  const [open, setOpen] = useState(null);
  const itemRefs = useRef({});

  const active = useMemo(
    () => PROJECTS.find((p) => p.id === activeId) ?? PROJECTS[0],
    [activeId]
  );

  // ✅ This makes image paths work locally AND on GitHub Pages.
  // Expect active.media.src to be like: "media/nebula.jpg"
  const mediaSrc = useMemo(() => {
    const src = active?.media?.src;
    if (!src) return null;

    // If it's already an absolute URL (https://...), leave it alone
    if (/^https?:\/\//i.test(src)) return src;

    // Normalize: remove leading "/" so BASE_URL + src doesn't become "//"
    const normalized = src.replace(/^\/+/, "");

    // BASE_URL is "/" locally, and "/portfolio/" on your GitHub Pages project site
    return `${import.meta.env.BASE_URL}${normalized}`;
  }, [active]);

  useEffect(() => {
    const els = PROJECTS.map((p) => itemRefs.current[p.id]).filter(Boolean);
    if (!els.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const best = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];

        if (best?.target?.dataset?.pid) setActiveId(best.target.dataset.pid);
      },
      {
        root: null,
        threshold: [0.2, 0.35, 0.5, 0.65, 0.8],
        rootMargin: "-20% 0px -55% 0px",
      }
    );

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section id="projects" style={{ padding: "60px 0" }}>
      <div className="container">
        <div className="projectsLayout">
          {/* Left: scroll chapters */}
          <div className="projectsList">
            <div className="muted" style={{ fontSize: 14, marginBottom: 18 }}>
              Selected work
            </div>

            {PROJECTS.map((p) => (
              <div
                key={p.id}
                data-pid={p.id}
                ref={(el) => (itemRefs.current[p.id] = el)}
                className={`projectChapter ${p.id === activeId ? "isActive" : ""}`}
              >
                <button
                  className="projectTitleBtn"
                  onClick={() => setOpen(p)}
                  aria-label={`Open ${p.name} details`}
                >
                  <div className="projectTitleRow">
                    <div className="projectTitle">{p.name}</div>
                    <div className="muted">Open</div>
                  </div>
                </button>

                <div className="muted projectBlurb">{p.blurb}</div>

                <div className="projectMetaRow">
                  {p.tags?.slice(0, 5)?.map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Right: sticky preview */}
          <div className="projectsPreview">
            <div className="previewCard">
              <div className="muted" style={{ fontSize: 13, marginBottom: 10 }}>
                Preview
              </div>

              <div className="previewMedia">
                <AnimatePresence mode="wait">
                  {mediaSrc ? (
                    <motion.img
                      key={mediaSrc || active?.id}
                      src={mediaSrc}
                      alt={active?.media?.alt || `${active?.name} preview`}
                      initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -6, filter: "blur(6px)" }}
                      transition={{ duration: 0.35 }}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      loading="lazy"
                    />
                  ) : (
                    <motion.div
                      key="no-media"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="muted"
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "grid",
                        placeItems: "center",
                        fontSize: 13,
                      }}
                    >
                      No preview image yet
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div style={{ marginTop: 14 }}>
                <div style={{ fontWeight: 750 }}>{active?.name}</div>
                <div className="muted" style={{ marginTop: 6, lineHeight: 1.55 }}>
                  {active?.blurb}
                </div>

                <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
                  {active?.links?.demo && (
                    <a className="pill" href={active.links.demo} target="_blank" rel="noreferrer">
                      Demo
                    </a>
                  )}
                  {active?.links?.code && (
                    <a className="pill" href={active.links.code} target="_blank" rel="noreferrer">
                      Code
                    </a>
                  )}
                  <button className="pill" onClick={() => setOpen(active)}>
                    Case study
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {open && <ProjectModal project={open} onClose={() => setOpen(null)} />}
      </div>
    </section>
  );
}
