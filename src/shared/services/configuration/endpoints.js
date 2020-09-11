import endpoints from './endpoints.json';

export const prefixEndpoints = (apiBaseUrl = '') => {
  const prefix = apiBaseUrl === null || apiBaseUrl === undefined ? '' : apiBaseUrl;
  return Object.entries(endpoints)
    .filter(([key]) => key.charAt(0) !== '_')
    .reduce((acc, [key, value]) => {
      acc[key] = `${prefix}${value}`;
      return acc;
    }, {});
};
