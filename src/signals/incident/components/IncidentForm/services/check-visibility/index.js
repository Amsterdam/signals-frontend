import { every, isEqual, some } from 'lodash';

const checkVisibility = (control, incident, isAuthenticated) => {
  let isVisible = true;

  if (control.meta.ifAllOf) {
    if (!every(control.meta.ifAllOf, (value, key) =>
      !Array.isArray(value) ? isEqual(value, incident[key]) :
        every(value, (v) => isEqual(v, incident[key])))) {
      isVisible = false;
    }
  }

  if (control.meta.ifOneOf) {
    if (!some(control.meta.ifOneOf, (value, key) =>
      !Array.isArray(value) ? isEqual(value, incident[key]) :
        some(value, (v) => isEqual(v, incident[key])))) {
      isVisible = false;
    }
  }

  if (control.meta.ifNoneOf) {
    if (!every(control.meta.ifNoneOf, (value, key) =>
      !Array.isArray(value) ? !isEqual(value, incident[key]) :
        every(value, (v) => !isEqual(v, incident[key])))) {
      isVisible = false;
    }
  }

  if (control.authenticated) {
    isVisible = isVisible && isAuthenticated;
  }
// console.log(isVisible, control, isAuthenticated);
  return isVisible;
};

export default checkVisibility;
