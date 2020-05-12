const config = {};

const reset = () => {
  const newConfig = JSON.parse(JSON.stringify(window.CONFIG || {}));
  Object.keys(config).forEach(key => {
    delete config[key];
  });
  Object.keys(newConfig).forEach(key => {
    config[key] = newConfig[key];
  });
  config.__reset = reset;
};

reset();

export default config;
