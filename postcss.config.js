// Update Browser's List to support specific browsers

module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-preset-env': {
      /* support last 2 versions of all browsers */
      browsers: 'last 2 versions',
      /* use stage 0 features + css nesting rules */
      stage: 0,
      features: {
        'nesting-rules': true
      },
    },
    'cssnano': {},
  },
};
