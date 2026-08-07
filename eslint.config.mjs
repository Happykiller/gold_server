// Flat config ESLint 9.
//
// Reprend à l'identique les règles de l'ancien `.eslintrc.js`, devenu illisible
// pour ESLint depuis la v9 : le lint échouait en silence sur
// « couldn't find an eslint.config file » sans que rien ne le signale, faute
// de CI.
//
// Même structure que gold_front, aux différences de plateforme près : ici on
// est sous Node, sans React.
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**', 'eslint.config.mjs'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      // Règles reprises de l'ancienne configuration.
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',

      // `of` et `type` sont les paramètres conventionnels des décorateurs
      // NestJS GraphQL (`@Query((of) => Model)`, `@Field((type) => Int)`) :
      // ils ne sont jamais lus, c'est l'idiome du framework.
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_|^of$|^type$' },
      ],

      // Une interface vide qui étend un DTO de service est un alias de nommage
      // volontaire, pas un oubli.
      '@typescript-eslint/no-empty-object-type': [
        'error',
        { allowInterfaces: 'with-single-extends' },
      ],
    },
  },
  // Chargements dynamiques assumés : la configuration se résout par
  // `require('./' + NODE_ENV)`, dotenv est chargé à la volée, et les tests
  // rechargent des modules pour en isoler les effets de bord.
  {
    files: [
      'src/config/**/*.ts',
      'src/main.ts',
      '**/*.spec.ts',
      '**/*.e2e-spec.ts',
    ],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  prettierRecommended,
);
