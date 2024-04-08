import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel/serverless";
import auth from "auth-astro";
import tailwind from "@astrojs/tailwind";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [auth(), tailwind(), react()],
  output: "server",
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
  images: {
    domains: ["static-cdn.jtvnw.net"],
  },
});
