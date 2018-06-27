import { forEach, every } from 'lodash';

const formatConditionalForm = (form, incident) => {
  if (form && form.controls) {
    const removeKeys = [];

    forEach(form.controls, (control, key) => {
      if (control.meta && control.meta.if) {
        if (!every(control.meta.if, (v, k) => v === incident[k])) {
          removeKeys.push(key);
        }
      }
    });

    if (removeKeys.length) {
      removeKeys.map((key) => {
        delete form.controls[key]; // eslint-disable-line no-param-reassign
        return true;
      });
    }
  }

  return form;
};

export default formatConditionalForm;
