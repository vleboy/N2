module.exports = {
  productionSourceMap: false,

  configureWebpack: config => {
    config.optimization = {
      splitChunks: {
        minSize: 200000,
        maxSize: 250000,
      }
    }
    if (process.env.NODE_ENV != 'production') {
      config.devtool = false
    }
  },

  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },

  baseUrl: undefined,
  outputDir: undefined,
  assetsDir: undefined,
  runtimeCompiler: undefined,
  parallel: undefined,
  //css: undefined
}