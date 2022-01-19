// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Route } from 'react-router-dom'
import { Wizard, Steps, Step } from 'react-albus'
import {
  Heading,
  themeSpacing,
  StepByStepNav,
  Paragraph,
} from '@amsterdam/asc-ui'
import styled, { css } from 'styled-components'

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
    ${({ showProgress }) => (showProgress ? "'progress'" : '')}
    'header'
    'form';

  grid-column-gap: ${themeSpacing(5)};

  ${Header} {
    grid-area: header;
  }

  ${Progress} {
    padding-top: ${themeSpacing(8)};
    grid-area: progress;
    display: ${({ showProgress }) => (showProgress ? 'block' : 'none')};

    @media (max-width: ${({ theme }) => theme.layouts.medium.max - 1}px) {
      margin-left: ${themeSpacing(4)};
    }

    li {
      line-height: 20px;
    }
  }

  ${FormWrapper} {
    grid-area: form;
  }

  ${({ showProgress }) =>
    showProgress
      ? css`
          @media (min-width: ${({ theme }) => theme.layouts.medium.max}px) {
            grid-template-areas:
              'progress header'
              'progress form';
            grid-template-columns: 4fr 8fr;
          }
        `
      : ''};
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

  const steps = Object.values(wizardDefinition)
    .filter(({ countAsStep }) => countAsStep)
    .map(({ stepLabel }) => ({ label: stepLabel }))

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
                        postponeSubmitWhenLoading,
                        previewFactory,
                        sectionLabels,
                      } = wizardDefinition[key]

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
