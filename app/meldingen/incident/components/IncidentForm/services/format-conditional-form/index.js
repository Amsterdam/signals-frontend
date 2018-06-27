import { forEach, every } from 'lodash';

const formatConditionalForm = (form, incident) => {
  if (form && form.controls) {
    forEach(form.controls, (control, key) => {
      if (control.meta) {
        form.controls[key].meta.ifVisible = true;  // eslint-disable-line no-param-reassign
      }

      if (control.meta && control.meta.if) {
        if (!every(control.meta.if, (v, k) => v === incident[k])) {
          form.controls[key].meta.ifVisible = false;  // eslint-disable-line no-param-reassign
        }
      }
    });
  }

  return form;
};

export default formatConditionalForm;
