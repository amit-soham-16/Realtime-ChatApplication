module.exports = function override(config, env) {
  // stompjs uses Node's 'net' module in stomp-node.js which doesn't exist in browsers.
  // Tell webpack 5 to provide an empty module stub for 'net'.
  config.resolve.fallback = {
    ...config.resolve.fallback,
    net: false,
  };
  return config;
};
