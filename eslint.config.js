import globals from "globals";
import { defineConfig } from "eslint/config";
import prettier from "eslint-plugin-prettier";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      prettier,
    },
    rules: {
      "prettier/prettier": "warn",
    },
  },
]);
