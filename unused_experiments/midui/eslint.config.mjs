import typescriptEslint from "@typescript-eslint/eslint-plugin"
import tsParser from "@typescript-eslint/parser"

export default [
  {
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
      // we only enable the _strict_ necessary rules; most others are nitpicky and feel more like stylistic busywork rather than true error catchers
      // if a rule isn't here, it's deemed unnecessary or too slow to run. Or maybe we missed one or a new useful one got introduced after this file was last updated
      "no-duplicate-case": "error",
      "@typescript-eslint/ban-ts-comment": ["error", {
        "ts-expect-error": "allow-with-description",
      }],
      "no-unreachable": "error", // we use this instead of typescript's "allowUnreachableCode" (see tsconfig)
      "no-unused-expressions": "error", // good for cleaning up dead code
      "@typescript-eslint/no-unnecessary-type-assertion": "error", // during refactor, this catches the types that have changed and no longer need casting. Otherwise a forced casting is confusing; was it needed for obscure reasons, was it unnecessary to begin with, was it needed before but no longer, etc.

      "@typescript-eslint/prefer-nullish-coalescing": ["error", { // this disables `a || b` unless a is null, undefined or a boolean. Because '' || 'hi' and 0 || 'hi' are dangerous
        ignorePrimitives: {
          boolean: true,
        },
      }],

      "@typescript-eslint/strict-boolean-expressions": ["error", {
        allowNullableBoolean: true,
        allowString: false, // disable `!myString` and `!myNullableString` so that `!emptyString` is properly considered each callsite
      }],

      "@typescript-eslint/switch-exhaustiveness-check": ["error", {
        allowDefaultCaseForExhaustiveSwitch: false, // there's no reason this should be necessary. If there's truly a default case, then fix the type definition of the value being switched on
        requireDefaultForNonUnion: true,
      }],

      "@typescript-eslint/no-unnecessary-condition": ["error", { // this is a crucial rule to catch the unneeded e.g. foo && bar, if (items), etc. When you remove a value's nullability during a refactor, it's important that its callsites error and tell you that it's no longer nullable. Otherwise codebases only increase in null states instead of shrinking
        allowConstantLoopConditions: true,
      }],

      "@typescript-eslint/no-explicit-any": "error"
      // maybe we should enable these below
      // no-unsafe-argument
      // no-unsafe-assignment
      // no-unsafe-call
      // no-unsafe-function-type
      // no-unsafe-member-access
      // no-unsafe-return
    },
  }]
