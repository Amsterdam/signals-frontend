import { forEach } from 'lodash';

import checkVisibility from '../../../../services/check-visibility';

const formatConditionalForm = (form, incident, isAuthenticated) => {
  if (form && form.controls) {
    forEach(form.controls, (control, name) => {
      if (control.meta) {
        form.controls[name].meta.name = form.controls[name].meta.name || name;  // eslint-disable-line no-param-reassign
        form.controls[name].meta.isVisible = checkVisibility(control, incident, isAuthenticated);  // eslint-disable-line no-param-reassign
      }
    });
  }

  return form;
};

export default formatConditionalForm;
