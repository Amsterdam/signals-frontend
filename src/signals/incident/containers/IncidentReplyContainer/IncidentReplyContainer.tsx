// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { useEffect, useCallback, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Column, Row } from '@amsterdam/asc-ui'
import { useDispatch } from 'react-redux'

import LoadingIndicator from 'components/LoadingIndicator'
import Paragraph from 'components/Paragraph'
import { TYPE_LOCAL, VARIANT_ERROR } from 'containers/Notification/constants'
import { showGlobalNotification } from 'containers/App/actions'
import configuration from 'shared/services/configuration/configuration'
import useFetch, { FetchError } from 'hooks/useFetch'
import useGetQuestionnaire from 'hooks/api/qa/useGetQuestionnaire'
import useGetSession from 'hooks/api/qa/useGetSession'
import useGetPublicIncident from 'hooks/api/useGetPublicIncident'
import { FieldType } from 'types/api/qa/question'
import { filesUpload } from 'shared/services/files-upload/files-upload'

import { usePostAnswer } from 'hooks/api/qa/usePostAnswer'
import Notice from './components/Notice/Notice'
import QuestionnaireComponent from './components/Questionnaire'

import { Content, StyledHeading, StyledSubHeading, Wrapper } from './styled'
import * as constants from './constants'
import { FormAnswer } from './types'
import { formatDate } from './utils'

const IncidentReplyContainer = () => {
  const { uuid: sessionUuid } = useParams<{ uuid: string }>()
  const dispatch = useDispatch()
  const [isSubmittingForm, setIsSubmittingForm] = useState(false)
  const [submitFormError, setSubmitFormError] = useState(false)

  const { post: postAnswer, error: postAnswerError } = usePostAnswer()

  const {
    post: submitQuestionnaire,
    isSuccess: isSubmitted,
    error: submitError,
  } = useFetch()

  const {
    data: session,
    get: getSession,
    error: sessionError,
    isLoading: sessionIsLoading,
  } = useGetSession()

  const {
    data: questionnaire,
    isLoading: questionnaireIsLoading,
    error: questionnaireError,
    get: getQuestionnaire,
  } = useGetQuestionnaire()

  const {
    data: incident,
    isLoading: incidentIsLoading,
    error: incidentError,
    get: getIncident,
  } = useGetPublicIncident()

  const isExpired = useMemo(
    () =>
      sessionError &&
      typeof sessionError !== 'boolean' &&
      (sessionError as Response).status === constants.EXPIRED_STATUS &&
      (sessionError as FetchError).detail?.includes(constants.EXPIRED_DETAIL),
    [sessionError]
  )

  const isLocked = useMemo(
    () =>
      sessionError &&
      typeof sessionError !== 'boolean' &&
      (sessionError as Response).status === constants.LOCKED_STATUS &&
      (sessionError as FetchError).detail?.includes(constants.LOCKED_DETAIL),
    [sessionError]
  )

  const submit = useCallback(
    async (answers: FormAnswer[]) => {
      try {
        setSubmitFormError(false)
        if (!incident?.signal_id) throw 'No incident signal_id'
        if (!session?.uuid) throw 'No session uuid'

        setIsSubmittingForm(true)

        // The reply flow includes a single question
        const answer = answers[0]

        // The reply flow includes a single file input component
        const files = answers.find(
          (answer) => answer.fieldType === FieldType.FileInput
        )?.value as FileList

        if (files.length) {
          await filesUpload({
            url: `${configuration.INCIDENT_PUBLIC_ENDPOINT}${incident.signal_id}/attachments/`,
            files,
          })
        }

        await postAnswer(sessionUuid, answer.uuid, answer.value)
        await submitQuestionnaire(
          `${configuration.QA_SESSIONS_ENDPOINT}${session.uuid}/submit`
        )
      } catch (error) {
        setSubmitFormError(true)
      } finally {
        setIsSubmittingForm(false)
      }
    },
    [
      incident?.signal_id,
      postAnswer,
      session?.uuid,
      sessionUuid,
      submitQuestionnaire,
    ]
  )

  useEffect(() => {
    getSession(sessionUuid)
  }, [getSession, sessionUuid])

  useEffect(() => {
    if (!session) {
      return
    }

    // Fetch questionnaire
    const questionnaireLink =
      session._links['sia:questionnaire'].href.split('/')
    const questionnaireUuid = questionnaireLink[questionnaireLink.length - 1]
    getQuestionnaire(questionnaireUuid)

    // Fetch public incident
    const incidentLink = session._links['sia:public-signal'].href.split('/')
    const incidentUuid = incidentLink[incidentLink.length - 1]
    getIncident(incidentUuid)
  }, [session, getQuestionnaire, getIncident])

  const formattedDate = useMemo(
    () => (incident ? formatDate(new Date(incident.created_at)) : ''),
    [incident]
  )

  useEffect(() => {
    if (submitError || submitFormError || postAnswerError) {
      dispatch(
        showGlobalNotification({
          title: constants.GENERIC_ERROR_TITLE,
          message: constants.GENERIC_ERROR_CONTENT,
          variant: VARIANT_ERROR,
          type: TYPE_LOCAL,
        })
      )
    }
  }, [dispatch, postAnswerError, submitError, submitFormError])

  if (isExpired)
    return (
      <Notice
        title={constants.EXPIRED_TITLE}
        content={constants.EXPIRED_CONTENT}
      />
    )

  if (isLocked)
    return (
      <Notice
        title={constants.LOCKED_TITLE}
        content={constants.LOCKED_CONTENT}
      />
    )

  if (sessionError || questionnaireError || incidentError)
    // Shown in case of errors other than locked/expired
    return (
      <Notice
        title={constants.GENERIC_ERROR_TITLE}
        content={constants.GENERIC_ERROR_CONTENT}
      />
    )

  if (isSubmitted)
    return (
      <Notice
        title={constants.SUBMITTED_TITLE}
        content={constants.SUBMITTED_CONTENT}
      />
    )

  if (
    incidentIsLoading ||
    questionnaireIsLoading ||
    sessionIsLoading ||
    isSubmittingForm
  )
    return <LoadingIndicator />

  if (!incident || !questionnaire) return null

  return (
    <Row>
      <Column span={8}>
        <Wrapper>
          <StyledHeading>Aanvullende informatie</StyledHeading>
          <StyledSubHeading as="h2">Uw melding</StyledSubHeading>
          <Content>
            <Paragraph>Nummer: {incident._display}</Paragraph>
            <Paragraph>Gemeld op: {formattedDate}</Paragraph>
          </Content>
          <QuestionnaireComponent
            onSubmit={submit}
            questionnaire={questionnaire}
          />
        </Wrapper>
      </Column>
    </Row>
  )
}

export default IncidentReplyContainer
