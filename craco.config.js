// craco.config.js
module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Asegúrate de inicializar si no existe
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        buffer: require.resolve('buffer/')
      };
      return webpackConfig;
    }
  }
};
