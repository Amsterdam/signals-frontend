import { forEach } from 'lodash';

const formatConditionalForm = (form, incident) => {
  if (form && form.controls) {
    const removeKeys = [];

    forEach(form.controls, (control, key) => {
      if (control.meta && control.meta.if) {
        const ifKey = Object.keys(control.meta.if)[0];
        const ifValue = Object.values(control.meta.if)[0];
        if (incident[ifKey] !== ifValue) {
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
