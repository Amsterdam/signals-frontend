import checkVisibility from '../checkVisibility';

export default (form, incident) => {
  if (!form?.controls) return form;

  Object.entries(form.controls)
    .filter(([, control]) => control?.meta)
    .forEach(([name, control]) => {
      form.controls[name].meta.name = form.controls[name].meta.name || name; // eslint-disable-line no-param-reassign
      form.controls[name].meta.isVisible = checkVisibility(control, incident); // eslint-disable-line no-param-reassign
    }, form);

  return form;
};
