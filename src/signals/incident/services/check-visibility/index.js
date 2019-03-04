import { every, isEqual, some } from 'lodash';

const checkVisibility = (control, incident, isAuthenticated) => {
  let isVisible = true;

  if (control.meta && control.meta.ifAllOf) {
    if (!every(control.meta.ifAllOf, (value, key) =>
      !Array.isArray(value) ? isEqual(value, incident[key]) :
        every(value, (v) => isEqual(v, incident[key])))) {
      isVisible = false;
    }
  }

  if (control.meta && control.meta.ifOneOf) {
    if (!some(control.meta.ifOneOf, (value, key) => {
      const hasValue = Array.isArray(incident[key]) ? incident[key].includes(value) : isEqual(value, incident[key]);
      return !Array.isArray(value) ? hasValue :
        some(value, (v) => isEqual(v, incident[key]));
    })) {
      isVisible = false;
    }
  }

  if (control.authenticated) {
    isVisible = isVisible && isAuthenticated;
  }

  return isVisible;
};

export default checkVisibility;
