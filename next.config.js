const {
  PHASE_PRODUCTION_BUILD,
  PHASE_PRODUCTION_SERVER,
} = require("next/constants");

module.exports = (phase) => {
  let distDir = "build-dev";
  if (phase == PHASE_PRODUCTION_BUILD) {
    distDir = "build";
  } else if (phase == PHASE_PRODUCTION_SERVER) {
    distDir = "build-public";
  }

  return {
    // webpack: (
    //   config,
    //   { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
    // ) => {
    //   if (isServer) {
    //     if(!config.module.node){
    //       config.module.node = {}
    //     }
    //     config.module.node['osx-temperature-sensor'] = 'empty';
    //   }
    //   // Important: return the modified config
    //   return config
    // },
    reactStrictMode: true,
    basePath: "",
    // разкомментить перед билдом в прод. Не поддерживается turbopack, поэтому закомментил
    distDir, // dir to build to, and serve from. Next.js takes distDir as target directory when 'next build', and does the same when 'next start'.

    experimental: {
      // instrumentationHook: true
    },
    typescript: {
      // !! WARN !!
      // Dangerously allow production builds to successfully complete even if
      // your project has type errors.
      // !! WARN !!
      ignoreBuildErrors: true,
    },

    // async rewrites() {
    //   return [
    //     {
    //       source: '/item/[id]',
    //       destination: '/item?id=[id]',
    //     },
    //   ]
    // },

  };
};
