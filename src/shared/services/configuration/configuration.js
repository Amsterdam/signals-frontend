import ProxyPolyfillBuilder from 'proxy-polyfill/src/proxy';
const ProxyPolyfill = ProxyPolyfillBuilder();

const applicationConfig = {
  ...(window.CONFIG || {}),
};

export default new ProxyPolyfill(applicationConfig, {
  get(target, name, receiver) {
    if (!Reflect.has(target, name)) {
      throw new Error(`Setting ${name} not available in configuration`);
    }

    return Reflect.get(target, name, receiver);
  },
});
