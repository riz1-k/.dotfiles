/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import pluginJs from "@eslint/js";
import drizzle from "eslint-plugin-drizzle";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: globals.browser } },
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
      drizzle: drizzle,
    },
    rules: {
      "simple-import-sort/imports": "warn",
      "simple-import-sort/exports": "warn",
      // "drizzle/enforce-delete-with-where": "error",
      // "drizzle/enforce-update-with-where": "error",
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  pluginJs.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];
