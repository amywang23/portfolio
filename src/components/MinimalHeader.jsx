import React from "react";
import { Sun, Moon } from "lucide-react";
import { PROFILE } from "../data/profile";

export default function MinimalHeader({ theme, setTheme }) {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        backdropFilter: "blur(10px)",
        background: "color-mix(in srgb, var(--bg) 70%, transparent)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 0",
        }}
      >
        <button
          onClick={() => document.getElementById("top")?.scrollIntoView({ behavior: "smooth" })}
          style={{
            border: "none",
            background: "transparent",
            padding: 0,
            cursor: "pointer",
            display: "flex",
            alignItems: "baseline",
            gap: 10,
          }}
          aria-label="Go to top"
        >
          <span style={{ fontWeight: 850, letterSpacing: "-0.02em", fontSize: 16 }}>
            {PROFILE.name}
          </span>
          <span className="muted" style={{ fontSize: 13 }}>
            portfolio
          </span>
        </button>

        <button
          className="pill"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          <span className="muted" style={{ fontSize: 13 }}>
            {theme === "dark" ? "Light" : "Dark"}
          </span>
        </button>
      </div>
    </header>
  );
}
