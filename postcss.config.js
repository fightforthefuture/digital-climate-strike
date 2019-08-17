// Update Browser's List to support specific browsers

module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-preset-env': {
      browsers: 'last 2 versions',
    },
    'cssnano': {},
  },
};
