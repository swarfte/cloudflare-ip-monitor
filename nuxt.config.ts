// https://nuxt.com/docs/api/configuration/nuxt-config

import { fileURLToPath, URL } from "url";

export default defineNuxtConfig({
  alias: {
    "@components": fileURLToPath(new URL("./components", import.meta.url)),
    "@composables": fileURLToPath(new URL("./composables", import.meta.url)),
    "@api": fileURLToPath(new URL("./server/api", import.meta.url)),
    "@pages": fileURLToPath(new URL("./pages", import.meta.url)),
    "@utils": fileURLToPath(new URL("./utils", import.meta.url)),
    "@public": fileURLToPath(new URL("./public", import.meta.url)),
    "@shared": fileURLToPath(new URL("./shared", import.meta.url)),
    "@datatype": fileURLToPath(new URL("./shared/types", import.meta.url)),
    "@tools": fileURLToPath(new URL("./server/tools/", import.meta.url)),
  },
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  colorMode: {
    preference: "light",
  },
  eslint: {
    // options here
  },
  pwa: {
    /* PWA options */
    manifest: {
      id: "cloudflare-ip-monitor",
      name: "Cloudflare IP Monitor",
      short_name: "CFIPM",
      description: "Cloudflare IP Monitor",
      theme_color: "#ffffff",
      screenshots: [
        {
          src: "./public/screenshot/screenshot.png",
          sizes: "2560x1251",
          type: "image/png",
          form_factor: "wide",
          label: "Application",
        },
      ],
      icons: [
        {
          src: "./public/icons/icon_512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },

    workbox: {
      navigateFallback: "/",
      runtimeCaching: [
        {
          urlPattern: ({ url }) => url.pathname.startsWith("/"),
          handler: "NetworkFirst",
          options: {
            cacheName: "dynamic-cache",
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 300, // Cache for 5 minutes
            },
          },
        },
      ],
    },
    registerType: "autoUpdate",
  },
  modules: [
    "@nuxt/eslint",
    "@nuxt/ui",
    "@nuxt/fonts",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "@vueuse/nuxt",
    //"@nuxtjs/i18n",
    "@nuxtjs/device",
    "@vite-pwa/nuxt",
  ],
});
