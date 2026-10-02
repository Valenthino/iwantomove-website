import { FlatCompat } from "@eslint/eslintrc";
const compat = new FlatCompat({ baseDirectory: import.meta.dirname });
const config = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      ".next/**",
      ".data/**",
      "test-results/**",
      "next-env.d.ts",
      "node_modules/**",
      "marketing/creatives/out/**",
    ],
  },
];
export default config;
