import { forEach, every, some } from 'lodash';

const formatConditionalForm = (form, incident) => {
  if (form && form.controls) {
    forEach(form.controls, (control, name) => {
      if (control.meta) {
        form.controls[name].meta.name = form.controls[name].meta.name || name;  // eslint-disable-line no-param-reassign

        form.controls[name].meta.ifVisible = true;  // eslint-disable-line no-param-reassign
      }

      if (control.meta && control.meta.if) {
        if (!every(control.meta.if, (value, key) =>
          typeof value === 'string' ? value === incident[key] :
            some(value, (v) => v === incident[key]))) {
          form.controls[name].meta.ifVisible = false;  // eslint-disable-line no-param-reassign
        }
      }
    });
  }

  return form;
};

export default formatConditionalForm;
