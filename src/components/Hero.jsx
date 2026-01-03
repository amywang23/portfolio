import React from "react";
import { motion } from "framer-motion";
import { PROFILE } from "../data/profile";
import { smoothScrollTo } from "../utils/scroll";
import Particles from "./Particles";

export default function Hero() {
  return (
    <section id="top" style={{ position: "relative" }}>
      <Particles />

      <div className="container" style={{ padding: "120px 0 80px" }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: 820 }}
        >
          <div className="muted" style={{ fontSize: 14, marginBottom: 12 }}>
            {PROFILE.title} • {PROFILE.location}
          </div>

          <h1 className="h1" style={{ marginBottom: 18 }}>
            Building thoughtful software—
            <span style={{ opacity: 0.6 }}> clean, fast, and human.</span>
          </h1>

          <p className="muted" style={{ fontSize: 18, lineHeight: 1.6 }}>
            {PROFILE.tagline}
          </p>

          <div style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap" }}>
            <button
              className="pill"
              onClick={() => smoothScrollTo("projects")}
            >
              Selected work
            </button>

            <a className="pill" href={`mailto:${PROFILE.email}`}>
              Email
            </a>

            <a
              className="pill"
              href={PROFILE.links.github}
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
