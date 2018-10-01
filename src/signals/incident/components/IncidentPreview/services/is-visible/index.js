// import { get } from 'lodash';

function isVisible(subkey, value, { optional, authenticated }, isAuthenticated) {
  if (authenticated && !isAuthenticated) {
    return false;
  }
  return !optional || (optional && value);
}

export default isVisible;
