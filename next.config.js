require('dotenv').config();
const withLess = require('@zeit/next-less');

module.exports = withLess({
  env: {
    SERVER_PORT: process.env.SERVER_PORT,
    MONGO_URI: process.env.MONGO_URI,
    SITE_NAME: process.env.SITE_NAME,
    SITE_URL: process.env.SITE_URL,
    TOKEN_SECRET: process.env.TOKEN_SECRET,
    AWS_REGION: process.env.AWS_REGION,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    NOREPLY_EMAIL: process.env.NOREPLY_EMAIL,
    CLOUDINARY_URL: process.env.CLOUDINARY_URL,
    GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID,
    GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL,
    GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY,
    GOOGLE_VIEW_ID: process.env.GOOGLE_VIEW_ID,
  },
  lessLoaderOptions: {
    lessOptions: {
      javascriptEnabled: true,
    },
  },
  webpack: (config, { isServer }) => {
    // @svgr/webpack config
    config.module.rules.push({
      test: /\.svg$/,
      issuer: {
        test: /\.(js|ts)x?$/,
      },
      use: ['@svgr/webpack'],
    });

    // Antd config
    if (isServer) {
      const antStyles = /antd\/.*?\/style.*?/;
      const origExternals = [...config.externals];
      config.externals = [
        (context, request, callback) => {
          if (request.match(antStyles)) return callback();
          if (typeof origExternals[0] === 'function') {
            origExternals[0](context, request, callback);
          } else {
            callback();
          }
        },
        ...(typeof origExternals[0] === 'function' ? [] : origExternals),
      ];

      config.module.rules.unshift({
        test: antStyles,
        use: 'null-loader',
      });
    }

    return config;
  },
});
