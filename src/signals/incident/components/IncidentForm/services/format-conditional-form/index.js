import { forEach } from 'lodash';

import checkVisibility from '../check-visibility';

const formatConditionalForm = (form, incident, isAuthenticated) => {
  if (form && form.controls) {
    forEach(form.controls, (control, name) => {
      if (control.meta) {
        let isVisible = true;

        form.controls[name].meta.name = form.controls[name].meta.name || name;  // eslint-disable-line no-param-reassign

        isVisible = checkVisibility(control, incident, isAuthenticated);

        form.controls[name].meta.isVisible = isVisible;  // eslint-disable-line no-param-reassign
      }
    });
  }

  return form;
};

export default formatConditionalForm;
