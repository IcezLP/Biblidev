require('dotenv').config();

module.exports = {
  env: {
    SERVER_PORT: process.env.SERVER_PORT,
    MONGO_URI: process.env.MONGO_URI,
    SITE_NAME: process.env.SITE_NAME,
    SITE_URL: process.env.SITE_URL,
    TOKEN_SECRET: process.env.TOKEN_SECRET,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: {
        test: /\.(js|ts)x?$/,
      },
      use: ['@svgr/webpack'],
    });

    return config;
  },
};
