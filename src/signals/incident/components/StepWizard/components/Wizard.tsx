// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2022 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam
import type { ReactNode } from 'react'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { createMemoryHistory } from 'history'

import WizardContext from '../context/WizardContext'
import type { WizardApi } from '../context/WizardContext'

type Props = {
  history: any
  basename?: any
  exactMatch?: any
  onNext?: (wizard: WizardApi) => void
  ids?: string[]
  children: ReactNode
}

const Wizard = (props: Props) => {
  const [stepState, setStep] = useState<WizardApi['step']>({ id: '' })

  const [steps, setSteps] = useState<WizardApi['steps']>([{ id: '' }])

  const didMount = useRef(false)

  const history = useMemo(
    () => props.history || createMemoryHistory(),
    [props.history]
  )

  const ids = useMemo(() => steps.map((s) => s.id), [steps])

  const nextStep = ids[ids.indexOf(stepState.id) + 1]

  const previousStep = useMemo(() => {
    return ids[ids.indexOf(stepState.id) - 1]
  }, [ids, stepState.id])

  const basename = `${props.basename}/`

  const pathToStep = useCallback(
    (pathname: string) => {
      const id = pathname.replace(basename, '')
      const [stepFromFilter] = steps.filter((s: WizardApi['step']) =>
        props.exactMatch ? s.id === id : s.id && id.includes(s.id)
      )
      return stepFromFilter || stepState
    },
    [basename, props.exactMatch, stepState, steps]
  )

  const init = useCallback((steps: WizardApi['steps']) => {
    setSteps(steps)
    setStep(steps[0])
  }, [])

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true
      return
    }
    const stepFromPath = pathToStep(history.location.pathname)
    if (stepFromPath.id && steps.some((step) => step.id)) {
      setStep(stepFromPath)
    }
  }, [
    history.location.pathname,
    pathToStep,
    history.replace,
    history,
    steps,
    basename,
    ids,
  ])

  const set = useCallback(
    (step: any) => {
      if (!step) return
      history.push(`${basename}${step}`)
    },
    [history, basename]
  )

  const push = useCallback(
    (step = nextStep) => {
      set(step)
    },
    [nextStep, set]
  )

  const replace = useCallback(
    (step = nextStep) => {
      history.replace(`${basename}${step}`)
    },
    [history, nextStep, basename]
  )

  const pushPrevious = useCallback(
    (step = previousStep) => {
      set(step)
    },
    [previousStep, set]
  )

  const previous = useCallback(() => {
    pushPrevious()
  }, [pushPrevious])

  const next = useCallback(() => {
    if (props.onNext) {
      props.onNext(wizard)
    } else {
      push()
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
  }, [props, push, wizard])

  const wizard: WizardApi = useMemo(
    () => ({
      go: history.go,
      step: stepState,
      set,
      history,
      init,
      next,
      previous,
      push,
      replace,
      steps,
    }),
    [history, init, next, previous, push, replace, set, stepState, steps]
  )

  const initialOnNext = useRef(false)

  // listen for history changes and set set using pathToStep
  useEffect(() => {
    const unlisten = history.listen(({ pathname }: any) => {
      setStep(pathToStep(pathname))
    })

    if (props.onNext && !initialOnNext.current) {
      props.onNext(wizard)
      initialOnNext.current = true
    }
    return () => unlisten()
  }, [history, pathToStep, props, props.onNext, wizard])

  return (
    <WizardContext.Provider value={wizard}>
      {props.children}
    </WizardContext.Provider>
  )
}

Wizard.defaultProps = {
  basename: '',
}

export default memo(Wizard)
