import { createContext } from 'react'

type Step = {id: string}

export interface WizardApi {
  go?: () => void,
  set?: (step: Step) => void,
  history?: History,
  init?: (steps: WizardApi["steps"]) => void,
  push: (step: string) => void,
  next: () => void,
  previous: () => void,
  replace?: () => void,
  step: Step,
  steps: Step[],
}

const WizardContext = createContext<WizardApi>({
  step: {
    id: ''
  },
  steps: [{ id: '' }],
  previous: () => {
  },
  next: () => {
  },
  push: () => {}
})

export default WizardContext
