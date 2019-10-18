import { isArray, every, isEqual, some, isObject } from 'lodash';

const isValueEqual = (incident, value, key, callback) => isEqual(value, incident[key])
  || (isArray(incident[key]) && incident[key].includes(value))
  || (isArray(incident[key]) && callback(incident[key], item => item.id === value))
  || (isObject(incident[key]) && incident[key].value && isEqual(value, incident[key].value))
  || (isObject(incident[key]) && incident[key].id && isEqual(value, incident[key].id));

const checkVisibility = (control, incident, isAuthenticated) => {
  let isVisible = true;

  if (control.meta && control.meta.ifAllOf && incident) {
    if (!every(control.meta.ifAllOf, (value, key) => !Array.isArray(value) ? isValueEqual(incident, value, key, every)
      : every(value, v => isValueEqual(incident, v, key, every)))) {
      isVisible = false;
    }
  }

  if (control.meta && control.meta.ifOneOf && incident) {
    if (!some(control.meta.ifOneOf, (value, key) => !Array.isArray(value) ? isValueEqual(incident, value, key, some)
      : some(value, v => isValueEqual(incident, v, key, some)))) {
      isVisible = false;
    }
  }

  if (control.authenticated) {
    isVisible = isVisible && isAuthenticated;
  }

  return isVisible;
};

export default checkVisibility;
