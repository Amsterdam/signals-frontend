import type { FunctionComponent, ReactElement } from 'react'
import { Children, useContext, useEffect, useRef } from 'react'

import type { WizardApi } from '../context/WizardContext'
import WizardContext from '../context/WizardContext'

type Props = {
  step?: WizardApi['step']
  wizard?: WizardApi
  children: ReactElement[]
}

const Steps: FunctionComponent<Props> = ({ children, step }): any => {
  const wizardContext = useContext(WizardContext)

  const didMount = useRef(false)

  useEffect(() => {
    // get all the steps through React children
    const steps = Children.map<any, any>(
      children,
      ({ props: { children, render, ...config } }) => config
    )
    if (!didMount.current && wizardContext.init && steps) {
      wizardContext.init(steps)
      didMount.current = true
    }
  }, [children, wizardContext])

  const { id: activeId } = step || wizardContext.step
  const [child] = Children.toArray(children).filter(
    ({ props: { id } }: any) => id === activeId
  )
  return <>{child}</>
}

export default Steps
