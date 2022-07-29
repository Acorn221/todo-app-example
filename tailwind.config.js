/* eslint-disable import/no-extraneous-dependencies, global-require */

const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  compilerOptions: {
    baseUrl: 'src/',
  },
  plugins: [],
  include: [
    'src',
    'types',
  ],
};
