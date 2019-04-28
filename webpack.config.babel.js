import CleanWebpackPlugin from 'clean-webpack-plugin';
import path from 'path';

import HtmlWebpackPlugin from 'html-webpack-plugin';


const dist = 'dist';


const config = {
  entry: './src/index.js',
  output: {
    filename: 'player.js',
    path: path.resolve(__dirname, dist),
  },

  devtool: 'source-map',

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin(),
  ],

};


export default (env, argv) => {
  const htmlWebpackPlugin = [
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
  ];

  if (argv.mode === 'development') {
    config.plugins = htmlWebpackPlugin;
  }

  if (env && env.page) {
    config.plugins = htmlWebpackPlugin;
    config.output = {
      ...config.output,
      path: path.resolve(__dirname, 'docs'),
    };
  }

  return config;
};
