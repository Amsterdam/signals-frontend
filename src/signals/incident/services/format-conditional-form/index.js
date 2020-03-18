import forEach from 'lodash.foreach';

import checkVisibility from '../check-visibility';

export default (form, incident) => {
  if (form && form.controls) {
    forEach(form.controls, (control, name) => {
      if (control.meta) {
        form.controls[name].meta.name = form.controls[name].meta.name || name; // eslint-disable-line no-param-reassign
        form.controls[name].meta.isVisible = checkVisibility(control, incident); // eslint-disable-line no-param-reassign
      }
    });
  }

  return form;
};
