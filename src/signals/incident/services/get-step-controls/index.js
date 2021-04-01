// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import isFunction from 'lodash.isfunction';

const getStepControls = (step, incident) => {
  if (step && step.formFactory && isFunction(step.formFactory)) {
    const form = step.formFactory(incident);
    return form && form.controls;
  }

  return (step && step.form && step.form.controls) || {};
};

export default getStepControls;
