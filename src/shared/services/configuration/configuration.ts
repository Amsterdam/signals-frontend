import type endpointType from 'shared/services/configuration/endpoint-definitions';

import { prefixEndpoints } from './endpoints';
import type configurationType from '../../../../app.base.json';

const windowConfig = (window as Window & typeof globalThis & { CONFIG: typeof configurationType }).CONFIG;
const applicationConfig = windowConfig
  ? {
    ...windowConfig,
    ...(prefixEndpoints(windowConfig.apiBaseUrl) as typeof endpointType),
  }
  : {};

const deepFreeze = (object: Record<string, unknown>) => {
  // Retrieve the property names defined on object
  const propNames = Object.getOwnPropertyNames(object);

  // Freeze properties before freezing self

  for (const name of propNames) {
    const value = object[name];

    if (value && typeof value === 'object') {
      deepFreeze(value as Record<string, unknown>);
    }
  }

  return Object.freeze(object);
};

export default deepFreeze(applicationConfig) as typeof configurationType & typeof endpointType;

/*
const configProxy = new Proxy(applicationConfig, {
  get: (target, name, receiver) => Reflect.has(target, name) ? Reflect.get(target, name, receiver) : undefined,

  deleteProperty: () => {
    throw new Error('Props cannot be deleted');
  },
});

Object.preventExtensions(configProxy);

export default configProxy as typeof configurationType;
*/
