const webpack = require('webpack')
const viloveul = /^VILOVEUL_/

let base = "/"
if (process.env.NODE_ENV === "production") {
  base = process.env.VILOVEUL_BASEPATH
}

function resolveClientEnvi () {
  const env = {}
  Object.keys(process.env).forEach(key => {
    if (viloveul.test(key) || key === 'NODE_ENV') {
      env[key] = process.env[key]
    }
  })

  env.BASE_URL = base

  for (const key in env) {
    env[key] = JSON.stringify(env[key])
  }
  return {
    'process.env': env
  }
}

module.exports = {
  publicPath: base,
  assetsDir: "assets",
  runtimeCompiler: true,
  devServer: {
    host: "0.0.0.0",
    port: 19912
  },
  chainWebpack: (config) => {
    config.plugin('define').use(webpack.DefinePlugin, [
      resolveClientEnvi()
    ])
  }
}