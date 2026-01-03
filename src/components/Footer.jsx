import React from "react";
import { PROFILE } from "../data/profile";

export default function Footer() {
  return (
    <footer
      style={{
        padding: "80px 0 40px",
        borderTop: "1px solid var(--border)",
        marginTop: 80,
      }}
    >
      <div className="container">
        <div className="muted" style={{ fontSize: 14 }}>
          © {new Date().getFullYear()} {PROFILE.name}
        </div>
      </div>
    </footer>
  );
}
