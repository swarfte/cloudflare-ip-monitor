// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  colorMode: {
    preference: "light",
  },
  devServer: {
    port: Number(process.env.PORT as string),
  },

  eslint: {
    // options here
  },
  electron: {
    disableDefaultOptions: true,
    build: [
      {
        // Main-Process entry file of the Electron App.
        entry: "electron/main.ts",
      },
    ],
  },
  modules: [
    "@nuxt/eslint",
    "@nuxt/ui",
    "@nuxt/fonts",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "@vueuse/nuxt",
    // "@nuxtjs/i18n",
    "@nuxtjs/device",
    "nuxt-electron",
  ],
});
