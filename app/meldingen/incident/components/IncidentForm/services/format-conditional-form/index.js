import { filter } from 'lodash';

const formatConditionalForm = (form, incident) => {
  console.log('formatConditionalForm', form, incident);
  if (form && form.controls) {
    const controls = filter(form.controls, (control) => {
      console.log('yoooo', control);
      if (control.meta && control.meta.if) {
        const ifKey = Object.keys(control.meta.if)[0];
        const ifValue = Object.values(control.meta.if)[0];
        if (incident[ifKey] === ifValue) {
          console.log('---------------------------------------------- IF', ifKey, ifValue);
          return true;
        }
        return false;
      }
      return true;
    });

    return { controls };
  }

  return form;
};

export default formatConditionalForm;
