import forEach from 'lodash.foreach';
import set from 'lodash.set';
import isObject from 'lodash.isobject';

import getControls from '../get-controls';

const convertValue = (value) => {
  if (value === 0) {
    return 0;
  }
  if (value === true) {
    return 'ja';
  }
  if (value === false) {
    return 'nee';
  }
  if (isObject(value) && value.id) {
    return value.id;
  }

  return value;
};

const mapValues = (params, incident, wizard) => {
  forEach(wizard, (step) => {
    const controls = getControls(step, incident);

    forEach(controls, (control, name) => {
      const value = incident[name];
      const meta = control.meta;

      if (meta && meta.path) {
        const itemValue = convertValue(value);
        if (itemValue || itemValue === 0) {
          set(params, meta.path, itemValue);
        }
      }
    });
  });
};

export default mapValues;
