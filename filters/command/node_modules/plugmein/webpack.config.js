/* globals module */
module.exports = {
  mode: 'production',
  entry: './src/plugmein.js',
  output: {
    library: 'plugmein',
    libraryTarget: 'umd',
    filename: 'plugmein.js',
    globalObject: 'this'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [ [ 'env', {
              targets: {
                browsers: [
                  '>0.25%', 'not op_mini all'
                ]
              },
              exclude: [ 'transform-es2015-typeof-symbol' ]
            } ] ]
          }
        }
      }
    ]
  }
};
