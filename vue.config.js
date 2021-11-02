const StyleLintPlugin = require('stylelint-webpack-plugin')

module.exports = {
  css: {
    loaderOptions: {
      scss: {
        prependData: `
          @import "~@/scss/_variables.scss";
          @import "~@/scss/_mixins.scss";
        `
      }
    }
  },
  configureWebpack: {
    plugins: [
      new StyleLintPlugin({
        files: ['src/**/*.{vue,htm,html,css,sss,less,scss,sass}']
      })
    ]
  }
}
