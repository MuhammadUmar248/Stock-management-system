// next.config.mjs
console.log('NEXT_DISABLE_SWC:', process.env.NEXT_DISABLE_SWC);

export default {
  swcMinify: false,
  experimental: {
    swcLoader: true ,
    swcMinify: false,
  },
  webpack(config, options) {
    return config;
  },
};
