import every from 'lodash.every';
import isEqual from 'lodash.isequal';
import some from 'lodash.some';
import isObject from 'lodash.isobject';
import isArray from 'lodash.isarray';
import { isAuthenticated } from 'shared/services/auth/auth';

const isValueEqual = (incident, value, key, callback) =>
  isEqual(value, incident[key]) ||
  (isArray(incident[key]) && incident[key].includes(value)) ||
  (isArray(incident[key]) && callback(incident[key], item => item.id === value)) ||
  (isObject(incident[key]) && incident[key].value && isEqual(value, incident[key].value)) ||
  (isObject(incident[key]) && incident[key].id && isEqual(value, incident[key].id));

/**
 * Check for form field visibility
 *
 * A 'control' can be given conditions by which is determined if that control should be visible or not. The
 * possible conditions are 'ifAllOf' and 'ifOneOf'. The conditions can contain a list of options that need
 * to pass.
 *
 * A control will be visible when:
 * - both 'ifAllOf' and 'ifOneOf' do not contain conditions
 * - only 'ifAllOf' contains conditions and evaluates to true
 * - only 'ifOneOf'contains conditions and evaluates to true
 * - 'ifAllOf' evaluates to false and 'ifOneOf' evaluates to true
 * - 'ifAllOf' evaluates to true and 'ifOneOf' evaluates to true
 *
 * A control will not be visble when:
 * - 'ifAllOf' evaluates to false and 'ifOneOf' evaluates to false
 * - 'ifAllOf' evaluates to true and 'ifOneOf' evaluates to false
 *
 * @param {*} control
 * @param {*} incident
 * @returns {Boolean}
 */
const checkVisibility = (control, incident) => {
  let isVisible = true;

  if (control?.meta?.ifAllOf && incident) {
    if (
      !every(control.meta.ifAllOf, (value, key) =>
        !Array.isArray(value)
          ? isValueEqual(incident, value, key, every)
          : every(value, v => isValueEqual(incident, v, key, every))
      )
    ) {
      isVisible = false;
    }
  }

  if (control?.meta?.ifOneOf && incident) {
    if (
      !some(control.meta.ifOneOf, (value, key) =>
        !Array.isArray(value)
          ? isValueEqual(incident, value, key, some)
          : some(value, v => isValueEqual(incident, v, key, some))
      )
    ) {
      isVisible = false;
    }
  }

  if (control.authenticated) {
    isVisible = isVisible && isAuthenticated();
  }

  return isVisible;
};

export default checkVisibility;
