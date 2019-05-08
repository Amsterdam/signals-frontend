import { every, isEqual, some } from 'lodash';

const isValueEqual = (incident, value, key) => isEqual(value, incident[key])
  || (incident[key] && incident[key].value && isEqual(value, incident[key].value))
  || (incident[key] && incident[key].id && isEqual(value, incident[key].id));

const checkVisibility = (control, incident, isAuthenticated) => {
  let isVisible = true;

  if (control.meta && control.meta.ifAllOf && incident) {
    if (!every(control.meta.ifAllOf, (value, key) =>
      !Array.isArray(value) ? isValueEqual(incident, value, key) :
        every(value, (v) => isValueEqual(incident, v, key)))) {
      isVisible = false;
    }
  }

  if (control.meta && control.meta.ifOneOf && incident) {
    if (!some(control.meta.ifOneOf, (value, key) => {
      const hasValue = Array.isArray(incident[key]) ? incident[key].includes(value) : isValueEqual(incident, value, key);
      return !Array.isArray(value) ? hasValue :
        some(value, (v) => isValueEqual(incident, v, key));
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
