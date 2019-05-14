import isFunction from 'lodash.isfunction';

const getControls = (step, incident) => {
  if (step.formFactory && isFunction(step.formFactory)) {
    const form = step.formFactory(incident);
    return form && form.controls;
  }

  return (step.form && step.form.controls) || {};
};

export default getControls;
