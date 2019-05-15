import forEach from 'lodash.foreach';
import set from 'lodash.set';
import isObject from 'lodash.isobject';

import getStepControls from '../get-step-controls';
import convertValue from '../convert-value';

const mapValues = (params, incident, wizard) => {
  forEach(wizard, (step) => {
    const controls = getStepControls(step, incident);

    forEach(controls, (control, name) => { // eslint-disable-line consistent-return
      const value = incident[name];
      const meta = control.meta;

      if (meta && meta.path) {
        const itemValue = convertValue(value);
        if (isObject(itemValue) && itemValue.id) {
          return itemValue.id;
        }

        if (itemValue || itemValue === 0) {
          set(params, meta.path, itemValue);
        }
      }
    });
  });

  return params;
};

export default mapValues;
