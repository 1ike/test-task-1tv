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

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
      },
      // {
      //   test: /\.css$/,
      //   use: ['style-loader', 'css-loader'],
      // },
    ],
  },

  plugins: [
    new CleanWebpackPlugin(),
  ],

};


export default (env, argv) => {
  console.log(argv.mode);
  if (argv.mode === 'development') {
    config.devtool = 'source-map';
    config.plugins = [
      ...config.plugins,
      new HtmlWebpackPlugin({
        template: 'index.html',
      }),
    ];
  }

  if (argv.mode === 'production') {
    // ...
  }

  return config;
};
