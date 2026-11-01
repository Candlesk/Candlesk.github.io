import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  // Change this to your final deployment URL (used for the sitemap and RSS feed).
  site: "https://candlesk.github.io",
  integrations: [mdx(), sitemap(), tailwind()],
});
