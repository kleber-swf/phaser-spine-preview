const rules = require('./webpack.rules');
const plugins = require('./webpack.plugins');
const path = require('path');

const phaserModule = path.join(__dirname, '/node_modules/phaser-ce/build/custom');

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});


module.exports = {
  module: {
    rules,
  },
  target: 'electron-main',
  plugins: plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
    alias: {
      'phaser-ce': path.join(phaserModule, 'phaser-split.js'),
      'pixi': path.join(phaserModule, 'pixi.js'),
      'p2': path.join(phaserModule, 'p2.js'),
      '@k3n/phaser-spine': path.join(__dirname, 'node_modules/@k3n/phaser-spine/build/phaser-spine-webpack.js'),
    },
  },
  output: {
    publicPath: './../',
  },
};
