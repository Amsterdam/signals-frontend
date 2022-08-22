// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2022 Gemeente Amsterdam
import { useContext, useMemo, useState } from 'react'
import { Route } from 'react-router-dom'
import { Wizard, Steps, Step } from 'react-albus'
import { FormProvider, useForm } from 'react-hook-form'
import {
  StepByStepNav,
  breakpoint,
  Paragraph,
  ascDefaultTheme,
} from '@amsterdam/asc-ui'

import type { FC } from 'react'
import type {
  createIncident,
  getClassification,
  removeQuestionData,
  updateIncident,
  addToSelection,
  removeFromSelection,
} from 'signals/incident/containers/IncidentContainer/actions'
import type { Incident } from 'types/incident'
import type { WizardSection } from 'signals/incident/definitions/wizard'

import LoadingIndicator from 'components/LoadingIndicator'
import AppContext from 'containers/App/context'

import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import type { AnyObject } from 'yup/es/types'
import IncidentForm from '../IncidentForm'
import IncidentPreview from '../IncidentPreview'
import onNext from './services/on-next'

import {
  FormWrapper,
  Header,
  Progress,
  StepWrapper,
  StyledH1,
  Wrapper,
} from './styled'

interface IncidentWizardProps {
  wizardDefinition: WizardSection
  getClassification: typeof getClassification
  updateIncident: typeof updateIncident
  addToSelection: typeof addToSelection
  removeFromSelection: typeof removeFromSelection
  createIncident: typeof createIncident
  removeQuestionData: typeof removeQuestionData
  incidentContainer: {
    incident: Incident
    loading: boolean
  }
}

const IncidentWizard: FC<IncidentWizardProps> = ({
  wizardDefinition,
  getClassification,
  updateIncident,
  createIncident,
  addToSelection,
  removeFromSelection,
  removeQuestionData,
  incidentContainer,
}) => {
  // Controls is used here for setting the validations rules used in UseForm resolver.
  const [controls, setControls] = useState()
  const appContext = useContext(AppContext)
  const sources = appContext.sources

  const incident = useMemo(
    () => incidentContainer.incident,
    [incidentContainer.incident]
  )

  const steps = Object.values(wizardDefinition)
    .filter(({ countAsStep }) => countAsStep)
    .map(({ stepLabel }) => ({ label: stepLabel || '' }))

  /**
   * Init form: when values change, construct yup resolver with validators from wizard.
   * Use the validations from controls from IncidentForm.
   */
  const formMethods = useForm({
    resolver: yupResolver(constructYupResolver()),
    reValidateMode: 'onSubmit',
  })

  function constructYupResolver() {
    const schema = controls
      ? Object.fromEntries(
          Object.entries(controls).reduce(
            (acc: Array<[string, any]>, [key, control]: [string, any]) => {
              const validators: any = control?.options?.validators

              // All html fields start as a string
              let validationField: AnyObject = yup.string()

              // Except for locatie
              if (key === 'locatie' || key.startsWith('extra')) {
                validationField = yup.object()
              }

              // Chain multiple validators per field
              if (validators) {
                ;(Array.isArray(validators) ? validators : [validators]).map(
                  (validator) => {
                    if (validator === 'required') {
                      validationField = validationField.required()
                    }

                    if (validator === 'email') {
                      validationField = validationField.email()
                    }

                    if (Number.parseInt(validator)) {
                      validationField = validationField.max(
                        Number.parseInt(validator)
                      )
                    }

                    if (
                      Array.isArray(validator) &&
                      validator[0] === 'maxLength' &&
                      Number.parseInt(validator[1])
                    ) {
                      validationField = validationField.max(
                        Number.parseInt(validator[1])
                      )
                    } else if (typeof validator === 'function') {
                      validationField = validationField.test(
                        'custom',
                        (v: any) => validator({ value: v })?.custom,
                        (v: any) => !validator({ value: v })?.custom
                      )
                    }
                  }
                )

                acc.push([key, validationField])
              }
              return acc
            },
            []
          )
        )
      : {}
    return yup.object(schema)
  }

  return (
    <Wrapper>
      <Route
        render={({ history }) => (
          <Wizard
            history={history}
            onNext={(wiz) => onNext(wizardDefinition, wiz, incident)}
          >
            {incidentContainer.loading || appContext.loading ? (
              <LoadingIndicator />
            ) : (
              <Steps>
                {Object.keys(wizardDefinition).map((key, index) => (
                  <Step
                    key={key}
                    id={`incident/${key}`}
                    render={() => {
                      const {
                        countAsStep,
                        form,
                        formFactory,
                        label,
                        subHeader,
                        previewFactory,
                        sectionLabels,
                      } = wizardDefinition[key as keyof WizardSection]

                      const showProgress = index < steps.length

                      return previewFactory || form || formFactory ? (
                        <StepWrapper showProgress={showProgress}>
                          <Header>
                            <StyledH1>
                              {countAsStep && `${index + 1}. `}
                              {label || key}
                            </StyledH1>
                            {subHeader && <Paragraph>{subHeader}</Paragraph>}
                          </Header>

                          <Progress>
                            <StepByStepNav
                              steps={steps}
                              itemType="numeric"
                              activeItem={index + 1}
                              breakpoint={breakpoint(
                                'max-width',
                                'tabletM'
                              )({ theme: ascDefaultTheme })}
                            />
                          </Progress>

                          <FormWrapper>
                            {previewFactory && incident && sectionLabels && (
                              <IncidentPreview
                                incident={incident}
                                preview={previewFactory(incident)}
                                sectionLabels={sectionLabels}
                              />
                            )}

                            {(form || formFactory) && (
                              <FormProvider {...formMethods}>
                                <IncidentForm
                                  fieldConfig={
                                    form || formFactory(incident, sources)
                                  }
                                  setControls={setControls}
                                  reactHookFormMethods={formMethods}
                                  incidentContainer={incidentContainer}
                                  getClassification={getClassification}
                                  removeQuestionData={removeQuestionData}
                                  updateIncident={updateIncident}
                                  addToSelection={addToSelection}
                                  removeFromSelection={removeFromSelection}
                                  createIncident={createIncident}
                                  wizard={wizardDefinition}
                                />
                              </FormProvider>
                            )}
                          </FormWrapper>
                        </StepWrapper>
                      ) : null
                    }}
                  />
                ))}
              </Steps>
            )}
          </Wizard>
        )}
      />
    </Wrapper>
  )
}

export default IncidentWizard
