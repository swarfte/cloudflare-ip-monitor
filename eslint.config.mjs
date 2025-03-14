// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt(
  // Your custom configs here

  // allow the any type
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  }
);
