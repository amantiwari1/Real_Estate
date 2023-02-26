/** @type {import("eslint").Linter.Config} */
module.exports = {
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      parserOptions: {
        project: "tsconfig.json",
      },
    },
  ],
  ignorePatterns: ["node_modules/", "src/gql","src/pages/account/flovatar.jsx"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
  },
  plugins: ["@typescript-eslint"],
  extends: ["next/core-web-vitals", "plugin:@typescript-eslint/recommended"],
  rules: {
    "@next/next/no-img-element": "off",
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      {
        prefer: "type-imports",
        fixStyle: "inline-type-imports",
      },
    ],
  },
};
