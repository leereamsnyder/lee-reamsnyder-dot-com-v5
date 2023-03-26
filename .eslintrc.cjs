module.exports = {
  root: true,
  extends: [
    'standard',
    // prettier needs to be last as it UNSETS any styling lint errors that prettier doesn't play well with
    'prettier',
  ],
  plugins: ['svelte3'],
  overrides: [
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3',
      rules: {
        // it is valid in Svelte to initialize optional properties with undefined
        // eg export let thing = undefined
        // which tells Svelte that this prop is not required
        'no-undef-init': 0,

        // "standard" config includes eslint-plugin-import
        // which has some rules that not compatible with svelte
        // see: https://github.com/sveltejs/eslint-plugin-svelte3/blob/master/OTHER_PLUGINS.md
        'import/first': 0,
        'import/no-duplicates': 0,
        'import/no-mutable-exports': 0,
        'import/prefer-default-export': 0,
      },
    },
  ],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
  },
  env: {
    browser: true,
    es2017: true,
    node: true,
  },
}
