// SPDX-License-Identifier: MPL-2.0
import type { FC } from 'react'
// Copyright (C) 2018 - 2022 Gemeente Amsterdam
import { useContext, useMemo, useRef } from 'react'

import { Alert } from '@amsterdam/asc-ui'
import { ascDefaultTheme, breakpoint, Paragraph } from '@amsterdam/asc-ui/lib'
import { FormProvider, useForm } from 'react-hook-form'
import { Route } from 'react-router-dom'

import LoadingIndicator from 'components/LoadingIndicator'
import AppContext from 'containers/App/context'
import configuration from 'shared/services/configuration/configuration'
import type {
  addToSelection,
  createIncident,
  getClassification,
  removeFromSelection,
  removeQuestionData,
  updateIncident,
} from 'signals/incident/containers/IncidentContainer/actions'
import type { WizardSection } from 'signals/incident/definitions/wizard'
import type { Incident } from 'types/incident'

import onNext from './services/on-next'
import {
  FormWrapper,
  Header,
  Progress,
  StepWrapper,
  StyledH1,
  Wrapper,
} from './styled'
import IncidentForm from '../IncidentForm'
import IncidentPreview from '../IncidentPreview'
import { StepByStepNavClickable } from '../StepByStepNavClickable'
import { Step, Steps, Wizard } from '../StepWizard'

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
              {history.location.pathname === '/incident/beschrijf' &&
                configuration.featureFlags.showStrikeAlert && (
                  <Alert
                    level="error"
                    outline
                    style={{ marginTop: 60, marginBottom: 60 }}
                  >
                    Medewerkers van de gemeente staken van maandag 20 februari
                    06.30 uur tot maandag 27 februari. Daarom kunnen wij geen
                    meldingen oppakken over volle containers en afval en vuil op
                    straat. Wij pakken wel meldingen op over overlast: onze
                    handhavers zijn op straat, maar schrijven geen boetes uit.
                    Het kan ook wat langer duren dan u van ons gewend bent
                    voordat wij uw melding hebben afgehandeld. Lees meer in het{' '}
                    <a href={'https://www.amsterdam.nl/nieuws/'}>
                      nieuwsoverzicht.
                    </a>
                  </Alert>
                )}
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
