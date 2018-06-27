import { forEach, every } from 'lodash';

const formatConditionalForm = (form, incident) => {
  if (form && form.controls) {
    const removeKeys = [];

    forEach(form.controls, (control, key) => {
      if (control.meta) {
        form.controls[key].meta.ifVisible = true;  // eslint-disable-line no-param-reassign
      }

      if (control.meta && control.meta.if) {
        if (!every(control.meta.if, (v, k) => v === incident[k])) {
          removeKeys.push(key);
        }
      }
    });

    if (removeKeys.length) {
      removeKeys.map((key) => {
        form.controls[key].meta.ifVisible = false;  // eslint-disable-line no-param-reassign
        return true;
      });
    }
  }

  return form;
};

export default formatConditionalForm;
