import js from "@eslint/js"
import reactHooks from "eslint-plugin-react-hooks"
import tseslint from "typescript-eslint"

export default tseslint.config(
  /* Ignored paths */
  {
    ignores: ["dist/", "src-tauri/", "node_modules/", "*.config.*"],
  },

  /* Base JS rules */
  js.configs.recommended,

  /* TypeScript strict rules */
  ...tseslint.configs.recommended,

  /* React Hooks rules */
  {
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
    },
  },

  /* Project overrides */
  {
    rules: {
      // Allow unused vars prefixed with _
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // Relax for Tauri/Rust integration patterns
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
)
