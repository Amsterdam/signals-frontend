// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Route } from 'react-router-dom'
import { Wizard, Steps, Step } from 'react-albus'
import { Heading, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import LoadingIndicator from 'components/LoadingIndicator'

import AppContext from '../../../../containers/App/context'
import IncidentForm from '../IncidentForm'
import IncidentPreview from '../IncidentPreview'
import onNext from './services/on-next'

const StyledH1 = styled(Heading)`
  margin-top: ${themeSpacing(6)};
  margin-bottom: ${themeSpacing(5)};
`

const Wrapper = styled.div`
  width: 100%;
`

const Header = styled.header``
const Progress = styled.div``
const FormWrapper = styled.div``

const StepWrapper = styled.article`
  display: grid;
  grid-template-areas:
    'progress'
    'header'
    'form';
  grid-column-gap: ${themeSpacing(5)};

  ${Header} {
    grid-area: header;
  }

  ${Progress} {
    grid-area: progress;
  }

  ${FormWrapper} {
    grid-area: form;
  }

  @media (min-width: ${({ theme }) => theme.layouts.medium.max}px) {
    grid-template-areas:
      'progress header'
      'progress form';

    grid-template-columns: 4fr 8fr;
  }
`

const IncidentWizard = ({
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

  const numSteps = Object.values(wizardDefinition).filter(
    ({ countAsStep }) => countAsStep
  ).length

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
                        postponeSubmitWhenLoading,
                        previewFactory,
                        sectionLabels,
                      } = wizardDefinition[key]

                      return previewFactory || form || formFactory ? (
                        <StepWrapper>
                          <Header>
                            <StyledH1>
                              {countAsStep && `${index + 1}. `}
                              {label || key}
                            </StyledH1>
                          </Header>

                          <Progress>
                            Voortgang {index + 1} / {numSteps}
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
                                postponeSubmitWhenLoading={
                                  postponeSubmitWhenLoading
                                }
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

IncidentWizard.propTypes = {
  incidentContainer: PropTypes.object.isRequired,
  wizardDefinition: PropTypes.object.isRequired,
  getClassification: PropTypes.func.isRequired,
  removeQuestionData: PropTypes.func.isRequired,
  updateIncident: PropTypes.func.isRequired,
  createIncident: PropTypes.func.isRequired,
}

export default IncidentWizard
