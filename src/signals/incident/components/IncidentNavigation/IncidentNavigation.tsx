// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2023 Gemeente Amsterdam
import type { BaseSyntheticEvent } from 'react'
import { useContext, useEffect } from 'react'

import { themeSpacing, themeColor } from '@amsterdam/asc-ui'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import NextButton from 'components/NextButton'
import PreviousButton from 'components/PreviousButton'
import { makeSelectIncidentContainer } from 'signals/incident/containers/IncidentContainer/selectors'
import type {
  FormAction,
  WizardSection,
} from 'signals/incident/definitions/wizard'
import type { WizardSectionProp } from 'signals/incident/definitions/wizard'

import configuration from '../../../../shared/services/configuration/configuration'
import { WizardContext } from '../StepWizard'

const Nav = styled.div`
  align-items: center;
  background-color: ${themeColor('tint', 'level3')};
  display: flex;
  flex-direction: row-reverse;
  height: ${themeSpacing(16)};
  justify-content: space-between;
  margin-top: ${themeSpacing(7)};
  padding: ${themeSpacing(0, 4)};

  type=[button] {
    order: 1;
  }

  type=[submit] {
    order: 0;
  }
`

interface IncidentNavigationProps {
  meta: {
    wizard: WizardSection
    handleSubmit: (
      event: BaseSyntheticEvent | undefined,
      next: () => void,
      formAction?: FormAction
    ) => void
  }
}

const IncidentNavigation = ({ meta }: IncidentNavigationProps) => {
  const { wizard } = meta
  const { step, next, previous } = useContext(WizardContext)

  const currentStep = step?.id?.split('/').pop() as keyof WizardSection
  const wizardStep = currentStep !== 'bedankt' && wizard[currentStep]

  if (!wizardStep) return null
  return (
    wizardStep && (
      <WizardStep
        wizardStep={wizardStep}
        meta={meta}
        next={next}
        previous={() => {
          previous()
        }}
      />
    )
  )
}

interface WizardStepProps extends IncidentNavigationProps {
  wizardStep: WizardSectionProp
  next: () => void
  previous: () => void
}

const WizardStep = ({ wizardStep, meta, next, previous }: WizardStepProps) => {
  const { handleSubmit } = meta
  const navigate = useNavigate()
  const appMode = configuration.featureFlags.appMode

  useEffect(() => {
    // wizardStep.formAction is undefined when a user hits the refresh and when wizard-step-1 is rendered for the first time
    if (!wizardStep.formAction) {
      navigate('/incident/beschrijf')
    }
    /*
      Including navigate in the deps array will cause navigate to be called on every render
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wizardStep.formAction])
  /**
   * We should refactor reducers to use typescript, then use following types here instead of any.
   */
  const { mapActive } = useSelector(makeSelectIncidentContainer)

  return (
    (!mapActive &&
      (appMode ? (
        <NextButton
          appMode
          onClick={(e) => {
            handleSubmit(e, next, wizardStep.formAction)
          }}
          data-testid="next-button"
        >
          <span className="value">{wizardStep.nextButtonLabel}</span>
        </NextButton>
      ) : (
        <Nav className="incident-navigation">
          {wizardStep.nextButtonLabel && (
            <NextButton
              onClick={(e) => {
                handleSubmit(e, next, wizardStep.formAction)
              }}
              data-testid="next-button"
            >
              <span className="value">{wizardStep.nextButtonLabel}</span>
            </NextButton>
          )}

          {!appMode && wizardStep.previousButtonLabel ? (
            <PreviousButton
              className={wizardStep.previousButtonClass}
              onClick={previous}
              data-testid="previous-button"
            >
              {wizardStep.previousButtonLabel}
            </PreviousButton>
          ) : (
            <span />
          )}
        </Nav>
      ))) ||
    null
  )
}
export default IncidentNavigation
