// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 - 2023 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam
import type { ReactNode } from 'react'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useLocation, useNavigate } from 'react-router-dom'

import WizardContext from '../context/WizardContext'
import type { WizardApi } from '../context/WizardContext'

type Props = {
  basename?: any
  exactMatch?: any
  onNext?: (wizard: WizardApi) => void
  ids?: string[]
  children: ReactNode
}

const Wizard = (props: Props) => {
  const [stepState, setStep] = useState<WizardApi['step']>({ id: '' })

  const [steps, setSteps] = useState<WizardApi['steps']>([{ id: '' }])

  const navigate = useNavigate()
  const location = useLocation()

  const [stepsCompletedCount, setStepsCompletedCount] =
    useState<WizardApi['stepsCompletedCount']>(0)

  const didMount = useRef(false)

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
    const stepFromPath = pathToStep(location.pathname)
    if (stepFromPath.id && steps.some((step) => step.id)) {
      setStep(stepFromPath)
    }
  }, [location.pathname, pathToStep, steps, basename, ids])

  const set = useCallback(
    (step: any) => {
      if (!step) return
      navigate(`${basename}${step}`)
    },
    [navigate, basename]
  )

  // remove?
  const replace = useCallback(
    (step = nextStep) => {
      navigate(`${basename}${step}`, { replace: true })
    },
    [navigate, nextStep, basename]
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
      // todo whats this and what did push() do?
      // navigate()
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
  }, [props, navigate, wizard])

  const wizard: WizardApi = useMemo(
    () => ({
      navigate,
      step: stepState,
      set,
      init,
      next,
      previous,
      replace,
      steps,
      stepsCompletedCount,
      setStepsCompletedCount,
    }),
    [
      navigate,
      stepState,
      set,
      init,
      next,
      previous,
      replace,
      steps,
      stepsCompletedCount,
    ]
  )

  const initialOnNext = useRef(false)

  useEffect(() => {
    setStep(pathToStep(location.pathname))

    if (props.onNext && !initialOnNext.current) {
      props.onNext(wizard)
      initialOnNext.current = true
    }
  }, [pathToStep, location, props.onNext, wizard, props])

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
