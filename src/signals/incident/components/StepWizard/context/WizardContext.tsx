// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 - 2023 Gemeente Amsterdam
import { createContext } from 'react'

type Step = { id: string }

export interface WizardApi {
  navigate: (step: string) => void
  next: () => void
  previous: () => void
  step: Step
  steps: Step[]
  setStepsCompletedCount: (step: number) => void
  stepsCompletedCount: number
  push: (step?: string) => void
  replace?: () => void
  set?: (step: Step) => void
  history?: History
  init?: (steps: WizardApi['steps']) => void
  go?: () => void
}

const WizardContext = createContext<WizardApi>({
  step: { id: '' },
  steps: [{ id: '' }],
  stepsCompletedCount: 0,
  push: () => {},
  setStepsCompletedCount: () => {},
  previous: () => {},
  next: () => {},
  navigate: () => {},
})

export default WizardContext
