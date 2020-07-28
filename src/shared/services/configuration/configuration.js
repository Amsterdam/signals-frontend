const applicationConfig = {
  ...window.CONFIG || {},
};

const configProxy = new Proxy(applicationConfig, {
  get(target, name, receiver) {
    if (!Reflect.has(target, name)) {
      return undefined;
    }

    return Reflect.get(target, name, receiver);
  },

  deleteProperty() {
    throw new Error('Props cannot be deleted');
  },
});

Object.preventExtensions(configProxy);

export default configProxy;
