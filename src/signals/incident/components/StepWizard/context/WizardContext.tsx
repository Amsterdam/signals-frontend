import { createContext } from 'react'

type Step = { id: string }

export interface WizardApi {
  push: (step: string) => void
  next: () => void
  previous: () => void
  step: Step
  steps: Step[]
  // This method sets the completed steps count
  setStepsCompletedCount: (step: number) => void
  // The steps that are completed and valid or the step that is active
  stepsCompletedCount: number
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
  setStepsCompletedCount: () => {},
  previous: () => {},
  next: () => {},
  push: () => {},
})

export default WizardContext
