const path = require('path')
const HtmlPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'none', 
  entry: ['./webgl-programming-guide/main.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'webgl-programming-guide.min.js',
  },
  target: 'web',

  devtool: 'inline-source-map',

  devServer: {
    contentBase: path.join(__dirname, './'),
    port: 8080,
    open:'google chrome',
    host: '0.0.0.0',
    hot: true
  },
  
  plugins: [new HtmlPlugin({
    file:path.join(__dirname,'dist','index.html'),
    template:'./webgl-programming-guide/index.html'
  })
  ]
}