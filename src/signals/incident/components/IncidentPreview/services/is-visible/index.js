function isVisible(value, { optional, authenticated }, isAuthenticated) {
  if (authenticated && !isAuthenticated) {
    return false;
  }
  return !optional || (optional && value);
}

export default isVisible;
