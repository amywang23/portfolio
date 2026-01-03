import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProjectModal({ project, onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          display: "grid",
          placeItems: "center",
          zIndex: 50,
          padding: 16,
        }}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          className="card"
          style={{ maxWidth: 700, width: "100%", padding: 24 }}
        >
          <h3 style={{ marginTop: 0 }}>{project.name}</h3>
          <p className="muted">{project.blurb}</p>

          <ul style={{ paddingLeft: 18, lineHeight: 1.6 }}>
            {project.impact.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <a className="pill" href={project.links.demo} target="_blank" rel="noreferrer">
              Demo
            </a>
            <a className="pill" href={project.links.code} target="_blank" rel="noreferrer">
              Code
            </a>
            <button className="pill" onClick={onClose}>
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
