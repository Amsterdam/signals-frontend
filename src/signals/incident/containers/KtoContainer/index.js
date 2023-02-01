// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2022 Gemeente Amsterdam
import { Fragment, useEffect, useCallback, useReducer, useState } from 'react'

import {
  Row,
  Column,
  Heading,
  Paragraph,
  themeSpacing,
} from '@amsterdam/asc-ui'
import { useParams } from 'react-router-dom'
import { compose } from 'redux'
import styled from 'styled-components'

import LoadingIndicator from 'components/LoadingIndicator'
import useFetch from 'hooks/useFetch'
import configuration from 'shared/services/configuration/configuration'
import reducer from 'signals/incident/containers/IncidentContainer/reducer'

import KtoForm from './components/KtoForm'
import injectReducer from '../../../../utils/injectReducer'

const StyledHeading = styled(Heading)`
  margin-top: ${themeSpacing(6)};
`

const StyledParagraph = styled(Paragraph)`
  margin-top: ${themeSpacing(5)};
  white-space: pre-line;
`

const initialState = {
  formOptions: undefined,
  renderSection: undefined,
  shouldRender: false,
}

export const renderSections = {
  TOO_LATE: {
    title: 'Helaas, u kunt niet meer reageren op deze melding',
    body: 'Na ons antwoord hebt u 2 weken de tijd om een reactie te geven.',
  },
  FILLED_OUT: {
    title: 'U hebt al een reactie gegeven op deze melding',
    body: 'Door uw reactie weten we wat we goed doen en wat we kunnen verbeteren.',
  },
  NOT_FOUND: {
    title: 'Het feedback formulier voor deze melding kon niet gevonden worden',
  },
}

export const successSections = configuration.featureFlags
  .reporterMailHandledNegativeContactEnabled
  ? {
      ja: {
        title: 'Bedankt voor uw reactie',
        body: 'Door uw reactie weten we wat we goed doen en wat we kunnen verbeteren.',
      },
      nee: {
        title: 'Bedankt voor uw reactie',
        body: `Door uw reactie weten we wat we kunnen verbeteren.`,
      },
    }
  : {
      ja: {
        title: 'Bedankt voor uw feedback!',
        body: 'We zijn voortdurend bezig onze dienstverlening te verbeteren.',
      },
      nee: {
        title: 'Bedankt voor uw feedback!',
        body: `We zijn voortdurend bezig onze dienstverlening te verbeteren.`,
      },
    }

export const contactAllowedText =
  '\n U ontvangt direct een e-mail met een overzicht van uw reactie. Binnen 3 werkdagen leest u wat wij ermee gaan doen.'

// eslint-disable-next-line consistent-return
const reactReducer = (state, action) => {
  // eslint-disable-next-line default-case
  switch (action.type) {
    case 'SET_FORM_OPTIONS':
      return { ...state, formOptions: action.payload, shouldRender: true }

    case 'SET_RENDER_SECTION':
      return { ...state, renderSection: action.payload, shouldRender: true }
  }
}

export const KtoContainer = () => {
  const [state, dispatch] = useReducer(reactReducer, initialState)
  const { satisfactionIndication, uuid } = useParams()
  const isSatisfied = satisfactionIndication === 'ja'
  const [contactAllowed, setContactAllowed] = useState(
    configuration.featureFlags.reporterMailHandledNegativeContactEnabled &&
      satisfactionIndication === 'nee'
  )
  const {
    get: getCheck,
    isLoading: isLoadingCheck,
    error: errorCheck,
    put,
    isSuccess,
    data: dataFeedbackForms,
  } = useFetch()

  const {
    get: getOptions,
    isLoading: isLoadingOptions,
    data: options,
  } = useFetch()

  // first, retrieve the status of the feedback
  useEffect(() => {
    getCheck(`${configuration.FEEDBACK_FORMS_ENDPOINT}${uuid}`)
  }, [getCheck, uuid])

  // if the status retrieval is done, parse the response and retrieve the form options
  useEffect(() => {
    if (isLoadingCheck || isSuccess || errorCheck === undefined) return

    if (errorCheck === false) {
      getOptions(configuration.FEEDBACK_STANDARD_ANSWERS_ENDPOINT)
      return
    }

    parseResponse()
  }, [errorCheck, isLoadingCheck, isSuccess, getOptions, parseResponse])

  // on succesful retrieval of the form options, map the results and store them in the component's state
  useEffect(() => {
    if (!options || isLoadingOptions) return

    const opts = options.results
      .filter(({ is_satisfied }) => is_satisfied === isSatisfied)
      .map((option, index) => ({
        key: `key-${index}`,
        value: option.text,
        topic: option.topic,
      }))

    opts.push({ key: 'anders', value: 'Over iets anders.' })

    dispatch({ type: 'SET_FORM_OPTIONS', payload: opts })
  }, [options, satisfactionIndication, isLoadingOptions, isSatisfied])

  const parseResponse = useCallback(async () => {
    let payload = ''

    if (errorCheck?.detail === 'filled out') {
      payload = 'FILLED_OUT'
    } else if (errorCheck?.detail === 'too late') {
      payload = 'TOO_LATE'
    } else {
      payload = 'NOT_FOUND'
    }

    dispatch({ type: 'SET_RENDER_SECTION', payload })
  }, [errorCheck])

  const onSubmit = useCallback(
    (formData) => {
      put(`${configuration.FEEDBACK_FORMS_ENDPOINT}${uuid}`, formData)
    },
    [uuid, put]
  )

  if (isLoadingCheck || isLoadingOptions) {
    return <LoadingIndicator />
  }

  if (!state.shouldRender) return null
  return (
    <Fragment>
      <Row data-testid="kto-form-container">
        <Column span={12}>
          {isSuccess && (
            <header>
              <StyledHeading>
                {successSections[satisfactionIndication].title}
              </StyledHeading>
              <StyledParagraph data-testid="succes-section-body">
                {successSections[satisfactionIndication].body}
                {configuration.featureFlags
                  .reporterMailHandledNegativeContactEnabled &&
                  contactAllowed &&
                  contactAllowedText}
              </StyledParagraph>
            </header>
          )}

          {!isSuccess &&
            (state.renderSection ? (
              <header>
                <StyledHeading>
                  {renderSections[state.renderSection].title}
                </StyledHeading>
                <StyledParagraph>
                  {renderSections[state.renderSection].body}
                </StyledParagraph>
              </header>
            ) : (
              <StyledHeading>
                {isSatisfied
                  ? 'Ja, ik ben tevreden'
                  : 'Nee, ik ben niet tevreden met de behandeling van mijn melding'}
              </StyledHeading>
            ))}
        </Column>
      </Row>

      {state.formOptions && !isSuccess && (
        <Row>
          <Column
            span={{
              small: 2,
              medium: 2,
              big: 8,
              large: 8,
              xLarge: 8,
            }}
          >
            <KtoForm
              isSatisfied={isSatisfied}
              dataFeedbackForms={dataFeedbackForms}
              options={state.formOptions}
              onSubmit={onSubmit}
              setContactAllowed={setContactAllowed}
              contactAllowed={contactAllowed}
            />
          </Column>
        </Row>
      )}
    </Fragment>
  )
}

const withReducer = injectReducer({ key: 'incidentContainer', reducer })

export default compose(withReducer)(KtoContainer)
