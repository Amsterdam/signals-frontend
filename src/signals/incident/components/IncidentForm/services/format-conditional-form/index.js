import { forEach, every, isEqual, some } from 'lodash';

const formatConditionalForm = (form, incident, isAuthenticated) => {
  if (form && form.controls) {
    forEach(form.controls, (control, name) => {
      if (control.meta) {
        let ifVisible = true;

        form.controls[name].meta.name = form.controls[name].meta.name || name;  // eslint-disable-line no-param-reassign

        if (control.meta.ifAllOf) {
          if (!every(control.meta.ifAllOf, (value, key) =>
            !Array.isArray(value) ? isEqual(value, incident[key]) :
              every(value, (v) => isEqual(v, incident[key])))) {
            ifVisible = false;
          }
        }

        if (control.meta.ifOneOf) {
          if (!some(control.meta.ifOneOf, (value, key) =>
            !Array.isArray(value) ? isEqual(value, incident[key]) :
              some(value, (v) => isEqual(v, incident[key])))) {
            ifVisible = false;
          }
        }

        if (control.authenticated) {
          ifVisible = isAuthenticated;
        }

        if (!ifVisible) {
          form.controls[name].options = null;  // eslint-disable-line no-param-reassign
        }

        form.controls[name].meta.ifVisible = ifVisible;  // eslint-disable-line no-param-reassign
      }
    });
  }

  return form;
};

export default formatConditionalForm;
