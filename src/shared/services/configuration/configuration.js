import { prefixEndpoints } from './endpoints';

const applicationConfig = window.CONFIG ? { ...window.CONFIG, ...prefixEndpoints(window.CONFIG.apiBaseUrl) } : {};

const configProxy = new Proxy(applicationConfig, {
  get: (target, name, receiver) => (Reflect.has(target, name) ? Reflect.get(target, name, receiver) : undefined),

  deleteProperty: () => {
    throw new Error('Props cannot be deleted');
  },
});

Object.preventExtensions(configProxy);

export default configProxy;
