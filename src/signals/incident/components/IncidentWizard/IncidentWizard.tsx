// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2022 Gemeente Amsterdam
import { useContext, useMemo, useRef } from 'react'
import type { FC } from 'react'

import { breakpoint, Paragraph, ascDefaultTheme } from '@amsterdam/asc-ui/lib'
import { FormProvider, useForm } from 'react-hook-form'
import { Route } from 'react-router-dom'

import LoadingIndicator from 'components/LoadingIndicator'
import AppContext from 'containers/App/context'
import type {
  createIncident,
  getClassification,
  removeQuestionData,
  updateIncident,
  addToSelection,
  removeFromSelection,
} from 'signals/incident/containers/IncidentContainer/actions'
import type { WizardSection } from 'signals/incident/definitions/wizard'
import type { Incident } from 'types/incident'

import IncidentForm from '../IncidentForm'
import IncidentPreview from '../IncidentPreview'
import { StepByStepNavClickable } from '../StepByStepNavClickable'
import { Wizard, Steps, Step } from '../StepWizard'
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
  const controlsRef = useRef()
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
    resolver: controlsRef.current,
    reValidateMode: 'onSubmit',
  })

  return (
    <Wrapper>
      <FormProvider {...formMethods}>
        <Route
          render={({ history }) => (
            <Wizard
              history={history}
              onNext={(wiz) => {
                return onNext(wizardDefinition, wiz, incident)
              }}
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
                              <StepByStepNavClickable
                                steps={steps}
                                itemType="numeric"
                                activeItem={index}
                                wizardRoutes={Object.keys(wizardDefinition)}
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
                                <IncidentForm
                                  index={index}
                                  ref={controlsRef}
                                  reactHookFormProps={formMethods}
                                  fieldConfig={
                                    form || formFactory(incident, sources)
                                  }
                                  incidentContainer={incidentContainer}
                                  getClassification={getClassification}
                                  removeQuestionData={removeQuestionData}
                                  updateIncident={updateIncident}
                                  addToSelection={addToSelection}
                                  removeFromSelection={removeFromSelection}
                                  wizard={wizardDefinition}
                                  createIncident={createIncident}
                                />
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
      </FormProvider>
    </Wrapper>
  )
}

export default IncidentWizard
