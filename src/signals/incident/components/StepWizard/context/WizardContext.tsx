import { createContext } from 'react'

type Step = { id: string }

export interface WizardApi {
  push: (step: string) => void
  next: () => void
  previous: () => void
  step: Step
  steps: Step[]
  setStepsCompletedCount: (step: number) => void
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
