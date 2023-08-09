// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2023 Gemeente Amsterdam
import { Fragment, useEffect, useCallback, useReducer, useState } from 'react'
import type { Reducer } from 'react'

import { Row, Column } from '@amsterdam/asc-ui'
import { useParams } from 'react-router-dom'
import { compose } from 'redux'

import LoadingIndicator from 'components/LoadingIndicator'
import useFetch from 'hooks/useFetch'
import configuration from 'shared/services/configuration/configuration'
import reducer from 'signals/incident/containers/IncidentContainer/reducer'
import { isFetchError } from 'signals/shared/type-guards'

import KtoForm from './components/KtoForm/KtoForm'
import {
  renderSections,
  successSections,
  contactAllowedText,
} from './constants'
import type { SuccessSections, RenderSections } from './constants'
import { StyledHeading, StyledParagraph } from './styled'
import type {
  Action,
  AnswerResponse,
  FeedbackFormData,
  State,
  OptionMapped,
} from './types'
import { sortByTopic, stripLastNonLetterChar } from './utils'
import injectReducer from '../../../../utils/injectReducer'

const initialState: State = {
  formOptions: [],
  renderSection: undefined,
  shouldRender: false,
}

// istanbul ignore next
const reactReducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'SET_FORM_OPTIONS':
      return { ...state, formOptions: action.payload, shouldRender: true }

    case 'SET_RENDER_SECTION':
      return { ...state, renderSection: action.payload, shouldRender: true }

    default:
      return { ...state }
  }
}

export const KtoContainer = () => {
  const [state, dispatch] = useReducer<Reducer<State, Action>>(
    reactReducer,
    initialState
  )

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
  } = useFetch<FeedbackFormData>()

  const {
    get: getOptions,
    isLoading: isLoadingOptions,
    data: options,
  } = useFetch<AnswerResponse>()

  const parseResponse = useCallback(async () => {
    let payload = ''

    if (isFetchError(errorCheck) && errorCheck?.detail === 'filled out') {
      payload = 'FILLED_OUT'
    } else if (isFetchError(errorCheck) && errorCheck?.detail === 'too late') {
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

    const opts: OptionMapped[] = options.results
      .filter(({ is_satisfied }) => is_satisfied === isSatisfied)
      .map((option, index) => ({
        is_satisfied: option.is_satisfied,
        key: `key-${index}`,
        open_answer: option.open_answer,
        topic: option.topic,
        value: stripLastNonLetterChar(option.text),
      }))

    const sortedOptions = sortByTopic(opts)

    dispatch({ type: 'SET_FORM_OPTIONS', payload: sortedOptions })
  }, [options, satisfactionIndication, isLoadingOptions, isSatisfied])

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
                {
                  successSections[
                    satisfactionIndication as keyof SuccessSections
                  ].title
                }
              </StyledHeading>
              <StyledParagraph data-testid="succes-section-body">
                {
                  successSections[
                    satisfactionIndication as keyof SuccessSections
                  ].body
                }
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
                  {
                    renderSections[state.renderSection as keyof RenderSections]
                      .title
                  }
                </StyledHeading>
                <StyledParagraph>
                  {
                    renderSections[state.renderSection as keyof RenderSections]
                      .body
                  }
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

      {state.formOptions && !isSuccess && dataFeedbackForms && (
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
              contactAllowed={contactAllowed}
              dataFeedbackForms={dataFeedbackForms}
              isSatisfied={isSatisfied}
              onSubmit={onSubmit}
              options={state.formOptions}
              setContactAllowed={setContactAllowed}
            />
          </Column>
        </Row>
      )}
    </Fragment>
  )
}

const withReducer = injectReducer({ key: 'incidentContainer', reducer })

export default compose(withReducer)(KtoContainer)
