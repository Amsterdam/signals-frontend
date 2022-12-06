// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 - 2022 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam
import type { FunctionComponent, ReactElement } from 'react'
import { Children, memo, useContext, useEffect, useMemo } from 'react'

import type { WizardApi } from '../context/WizardContext'
import WizardContext from '../context/WizardContext'

type Props = {
  wizard?: WizardApi
  children: ReactElement[] | ReactElement
}

const Steps: FunctionComponent<Props> = ({ children }): any => {
  const wizardContext = useContext(WizardContext)

  useEffect(() => {
    if (wizardContext.init && !wizardContext.steps.some((step) => step.id)) {
      const steps = Children.map<any, any>(
        children,
        ({ props: { children, render, ...config } }) => config
      )
      wizardContext.init(steps)
    }
  }, [children, wizardContext])

  const { id: activeId } = wizardContext.step

  const [child] = useMemo(
    () =>
      Children.toArray(children).filter(
        ({ props: { id } }: any) => id === activeId
      ),
    [activeId, children]
  )

  return <>{child}</>
}

export default memo(Steps)
