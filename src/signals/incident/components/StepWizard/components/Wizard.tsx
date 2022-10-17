// eslint-disable-next-line no-restricted-imports
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { createMemoryHistory } from 'history'

import WizardContext from '../context/WizardContext'
import type { WizardApi } from '../context/WizardContext'

type Props = {
  history: any
  basename?: any
  exactMatch?: any
  onNext: (wizard: WizardApi) => void
  ids?: string[]
}

const Wizard: React.FC<Props> = (props) => {
  const [stepState, setStep] = useState<WizardApi['step']>({ id: '' })
  const [steps, setSteps] = useState<WizardApi['steps']>([{ id: '' }])

  const didMount = React.useRef(false)

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
  }, [])

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true
      return
    }
    const stepFromPath = pathToStep(history.location.pathname)

    if (stepFromPath.id) {
      setStep(stepFromPath)
    } else {
      history.replace(`${basename}${ids[0]}`)
    }
  }, [
    history.location.pathname,
    pathToStep,
    basename,
    ids,
    steps,
    stepState.id,
    history.replace,
    history,
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
  }, [history, pathToStep, props, wizard])

  return (
    <WizardContext.Provider value={wizard}>
      {props.children}
    </WizardContext.Provider>
  )
}

Wizard.defaultProps = {
  basename: '',
}

export default Wizard
