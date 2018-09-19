import { forEach, every, isEqual, some } from 'lodash';

const formatConditionalForm = (form, incident, isAuthenticated) => {
  if (form && form.controls) {
    forEach(form.controls, (control, name) => {
      if (control.meta) {
        let isVisible = true;

        form.controls[name].meta.name = form.controls[name].meta.name || name;  // eslint-disable-line no-param-reassign

        if (control.meta.ifAllOf) {
          if (!every(control.meta.ifAllOf, (value, key) =>
            !Array.isArray(value) ? isEqual(value, incident[key]) :
              every(value, (v) => isEqual(v, incident[key])))) {
            isVisible = false;
          }
        }

        if (control.meta.ifOneOf) {
          if (!some(control.meta.ifOneOf, (value, key) =>
            !Array.isArray(value) ? isEqual(value, incident[key]) :
              some(value, (v) => isEqual(v, incident[key])))) {
            isVisible = false;
          }
        }

        if (control.authenticated) {
          isVisible = isVisible && isAuthenticated;
        }

        form.controls[name].meta.isVisible = isVisible;  // eslint-disable-line no-param-reassign
      }
    });
  }

  return form;
};

export default formatConditionalForm;
