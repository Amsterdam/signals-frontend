import { forEach, every, some } from 'lodash';

const formatConditionalForm = (form, incident, isAuthenticated) => {
  if (form && form.controls) {
    forEach(form.controls, (control, name) => {
      if (control.meta) {
        let ifVisible = true;

        form.controls[name].meta.name = form.controls[name].meta.name || name;  // eslint-disable-line no-param-reassign

        if (control.meta.ifAllOf) {
          if (!every(control.meta.ifAllOf, (value, key) =>
            typeof value === 'string' ? value === incident[key] :
              every(value, (v) => v === incident[key]))) {
            ifVisible = false;
          }
        }

        if (control.meta.ifOneOf) {
          if (!some(control.meta.ifOneOf, (value, key) =>
            typeof value === 'string' ? value === incident[key] :
              some(value, (v) => v === incident[key]))) {
            ifVisible = false;
          }
        }

        if (control.authenticated) {
          ifVisible = isAuthenticated;
        }

        form.controls[name].meta.ifVisible = ifVisible;  // eslint-disable-line no-param-reassign
      }
    });
  }

  return form;
};

export default formatConditionalForm;
