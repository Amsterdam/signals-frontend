// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import React, { Fragment, useEffect, useCallback, useReducer } from 'react'
import styled from 'styled-components'
import {
  Row,
  Column,
  Heading,
  Paragraph,
  themeSpacing,
} from '@amsterdam/asc-ui'
import { useParams } from 'react-router-dom'

import configuration from 'shared/services/configuration/configuration'
import useFetch from 'hooks/useFetch'

import LoadingIndicator from 'components/LoadingIndicator'

import KtoForm from './components/KtoForm'

const StyledHeading = styled(Heading)`
  margin-top: ${themeSpacing(6)};
`

const StyledParagraph = styled(Paragraph)`
  margin-top: ${themeSpacing(5)};
`

const initialState = {
  formOptions: undefined,
  renderSection: undefined,
  shouldRender: false,
}

export const renderSections = {
  TOO_LATE: {
    title: 'Helaas, de mogelijkheid om feedback te geven is verlopen',
    body:
      'Na het afhandelen van uw melding heeft u 2 weken de gelegenheid om feedback te geven.',
  },
  FILLED_OUT: {
    title: 'Er is al feedback gegeven voor deze melding',
    body:
      'Nogmaals bedankt voor uw feedback. We zijn voortdurend bezig onze dienstverlening te verbeteren.',
  },
  NOT_FOUND: {
    title: 'Het feedback formulier voor deze melding kon niet gevonden worden',
  },
}

// eslint-disable-next-line consistent-return
const reducer = (state, action) => {
  // eslint-disable-next-line default-case
  switch (action.type) {
    case 'SET_FORM_OPTIONS':
      return { ...state, formOptions: action.payload, shouldRender: true }

    case 'SET_RENDER_SECTION':
      return { ...state, renderSection: action.payload, shouldRender: true }
  }
}

export const KtoContainer = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const {
    get: getCheck,
    isLoading: isLoadingCheck,
    error: errorCheck,
    put,
    isSuccess,
  } = useFetch()
  const {
    get: getOptions,
    isLoading: isLoadingOptions,
    data: options,
  } = useFetch()
  const { satisfactionIndication, uuid } = useParams()
  const isSatisfied = satisfactionIndication === 'ja'

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
      .map((option, index) => ({ key: `${index}`, value: option.text }))

    opts.push({ key: 'anders', value: 'Anders, namelijk...' })

    dispatch({ type: 'SET_FORM_OPTIONS', payload: opts })
  }, [options, satisfactionIndication, isLoadingOptions, isSatisfied])

  const parseResponse = useCallback(async () => {
    let payload = ''

    try {
      const { detail } = await errorCheck.json()

      if (detail === 'filled out') {
        payload = 'FILLED_OUT'
      } else if (detail === 'too late') {
        payload = 'TOO_LATE'
      } else {
        payload = 'NOT_FOUND'
      }
    } catch {
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
      <Row data-testid="ktoFormContainer">
        <Column span={12}>
          {isSuccess && (
            <header>
              <StyledHeading>Bedankt voor uw feedback!</StyledHeading>
              <StyledParagraph>
                We zijn voortdurend bezig onze dienstverlening te verbeteren.
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
                {isSatisfied ? 'Ja, ik ben' : 'Nee, ik ben niet'} tevreden met
                de behandeling van mijn melding
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
              options={state.formOptions}
              onSubmit={onSubmit}
            />
          </Column>
        </Row>
      )}
    </Fragment>
  )
}

export default KtoContainer
