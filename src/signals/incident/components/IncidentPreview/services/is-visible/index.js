import { isAuthenticated } from 'shared/services/auth/auth';

function isVisible(value, { optional, authenticated }) {
  if (authenticated && !isAuthenticated()) {
    return false;
  }
  return Boolean(!optional || (optional && value));
}

export default isVisible;
