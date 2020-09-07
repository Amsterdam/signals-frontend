import isNil from 'lodash.isnil';
import endpoints from './endpoints.json';

export const prefixEndpoints = (apiBaseUrl = '') => {
  const prefix = isNil(apiBaseUrl) ? '' : apiBaseUrl;
  return Object.entries(endpoints).reduce((acc, [key, value]) => {
    acc[key] = `${prefix}${value}`;
    return acc;
  }, {});
};
