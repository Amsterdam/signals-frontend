function isVisible(value, { optional, authenticated }, isAuthenticated) {
  if (authenticated && !isAuthenticated) {
    return false;
  }
  return Boolean(!optional || (optional && value));
}

export default isVisible;
