import typescriptEslint from "@typescript-eslint/eslint-plugin"
import tsParser from "@typescript-eslint/parser"

export default [{
  ignores: ["**/node_modules"],
}, {
  languageOptions: {
    parser: tsParser,
    ecmaVersion: 5,
    sourceType: "script",

    parserOptions: {
      project: "./tsconfig.json",
    },
  },

  rules: {},
}, {
  files: ["src/**/*.tsx", "src/**/*.ts"],

  plugins: {
    "@typescript-eslint": typescriptEslint,
  },

  rules: {
    "no-duplicate-case": "error",
    "@typescript-eslint/ban-ts-comment": ["error", {
      "ts-expect-error": false,
    }],
    "no-unreachable": "error", // we use this instead of typescript's "allowUnreachableCode" (see tsconfig)
    "no-unused-expressions": "error",
    "@typescript-eslint/no-unnecessary-type-assertion": "error",

    "@typescript-eslint/prefer-nullish-coalescing": ["error", {
      ignorePrimitives: {
        boolean: true,
      },
    }],

    "@typescript-eslint/strict-boolean-expressions": ["error", {
      allowNullableBoolean: true,
      allowString: false, // disable `!myString` and `!myNullableString`
    }],

    "@typescript-eslint/switch-exhaustiveness-check": ["error", {
      allowDefaultCaseForExhaustiveSwitch: false,
      requireDefaultForNonUnion: true,
    }],

    "@typescript-eslint/no-unnecessary-condition": ["error", {
      allowConstantLoopConditions: true,
    }],
  },
}]
