import js from "@eslint/js";
import { configs as tsConfigs } from "typescript-eslint";
import * as tsParser from "@typescript-eslint/parser";
import { importX } from "eslint-plugin-import-x";
import n from "eslint-plugin-n";
import prettier from "eslint-plugin-prettier/recommended";
import vitest from "@vitest/eslint-plugin";
import globals from "globals";
import { fileURLToPath } from "url";

export default [
  {
    ignores: [
      "**/dist/",
      "**/coverage/",
      "**/node_modules/",
      "**/gen/",
      "examples/"
    ]
  },
  js.configs.recommended,
  ...tsConfigs.recommendedTypeChecked,
  {
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        projectService: {
          allowDefaultProject: [".vitest/setup.ts"]
        },
        tsconfigRootDir: fileURLToPath(new URL("./", import.meta.url))
      },
      globals: {
        ...globals.node
      }
    }
  },
  {
    files: ["**/*.{js,cjs,mjs}"],
    ...tsConfigs.disableTypeChecked
  },
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  n.configs["flat/recommended"],
  {
    rules: {
      "n/no-unsupported-features/es-syntax": [
        "error",
        { ignores: ["modules"] }
      ],
      "n/no-missing-import": "off",
      "n/no-unpublished-bin": "off",
      "no-restricted-imports": [
        "error",
        {
          name: "lodash",
          message:
            "Do not use lodash because it doesn't support ES modules. Please use es-toolkit instead."
        },
        {
          name: "lodash-es",
          message: "Please use es-toolkit instead."
        }
      ],
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-parameter-properties": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/require-await": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/explicit-function-return-type": [
        "warn",
        { allowExpressions: true }
      ]
    }
  },
  {
    files: ["**/__tests__/**/*.{js,mjs,ts}"],
    plugins: { vitest },
    rules: {
      ...vitest.configs.recommended.rules,
      "@typescript-eslint/ban-ts-comment": "off",
      "n/no-unpublished-import": "off"
    }
  },
  {
    files: ["first-party/*/scripts/**/*.ts", "third-party/*/scripts/**/*.ts"],
    rules: {
      "n/no-unpublished-import": "off"
    }
  },
  prettier
];
