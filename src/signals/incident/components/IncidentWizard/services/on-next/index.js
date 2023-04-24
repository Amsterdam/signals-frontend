// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2023 Gemeente Amsterdam
function onNext(wizardDefinition, { step, steps, navigate }, incident) {
  const wizardStep = step.id && step.id.split('/').reverse()[0]
  const nextStep =
    wizardStep &&
    wizardDefinition[wizardStep] &&
    wizardDefinition[wizardStep].getNextStep &&
    wizardDefinition[wizardStep].getNextStep(wizardDefinition, incident)

  if (nextStep) {
    navigate(nextStep)
  } else if (steps.length > 0) {
    navigate()
  }
}

export default onNext
