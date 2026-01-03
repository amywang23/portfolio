import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// IMPORTANT: set base to your repo name (or "/" if using username.github.io root site)
export default defineConfig({
  plugins: [react()],
  base: "/portfolio/",
});
