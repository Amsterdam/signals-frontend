// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { useContext, useMemo } from 'react'
import { Route } from 'react-router-dom'
import { Wizard, Steps, Step } from 'react-albus'
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
} from 'signals/incident/containers/IncidentContainer/actions'
import type { Incident } from 'types/incident'
import type { WizardSection } from 'signals/incident/definitions/wizard'

import LoadingIndicator from 'components/LoadingIndicator'
import AppContext from 'containers/App/context'

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
  removeQuestionData,
  incidentContainer,
}) => {
  const appContext = useContext(AppContext)
  const sources = appContext.sources
  const incident = useMemo(
    () => incidentContainer.incident,
    [incidentContainer.incident]
  )

  const steps = Object.values(wizardDefinition)
    .filter(({ countAsStep }) => countAsStep)
    .map(({ stepLabel }) => ({ label: stepLabel || '' }))

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
                              <IncidentForm
                                fieldConfig={
                                  form || formFactory(incident, sources)
                                }
                                incidentContainer={incidentContainer}
                                getClassification={getClassification}
                                removeQuestionData={removeQuestionData}
                                updateIncident={updateIncident}
                                createIncident={createIncident}
                                wizard={wizardDefinition}
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
    </Wrapper>
  )
}

export default IncidentWizard
