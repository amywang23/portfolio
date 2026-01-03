import React, { useState } from "react";
import { PROJECTS } from "../data/projects";
import ProjectModal from "./ProjectModal";
import { motion } from "framer-motion";

export default function Projects() {
  const [active, setActive] = useState(null);

  return (
    <section id="projects" style={{ padding: "40px 0" }}>
      <div className="container">
        <h2 className="h2" style={{ marginBottom: 24 }}>
          Selected work
        </h2>

        <div style={{ display: "grid", gap: 16 }}>
          {PROJECTS.map((p) => (
            <motion.button
              key={p.id}
              onClick={() => setActive(p)}
              whileHover={{ x: 6 }}
              className="projectRow"
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{p.name}</div>
                  <div className="muted" style={{ marginTop: 6 }}>
                    {p.blurb}
                  </div>
                </div>
                <span className="muted">View</span>
              </div>
            </motion.button>
          ))}
        </div>

        {active && (
          <ProjectModal project={active} onClose={() => setActive(null)} />
        )}
      </div>
    </section>
  );
}
