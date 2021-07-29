import { useEffect, useCallback, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Column, Row } from '@amsterdam/asc-ui'

import LoadingIndicator from 'components/LoadingIndicator'
import Paragraph from 'components/Paragraph'
import configuration from 'shared/services/configuration/configuration'
import { Answer } from 'types/api/qa/answer'
import { FieldType } from 'types/api/qa/question'

import useFetch, { FetchError } from 'hooks/useFetch'
import useGetQuestionnaire from 'hooks/api/qa/useGetQuestionnaire'
import useGetSession from 'hooks/api/qa/useGetSession'
import useGetPublicIncident from 'hooks/api/useGetPublicIncident'

import nl from 'date-fns/locale/nl'
import { format } from 'date-fns'
import Notice from './components/Notice/Notice'
import QuestionnaireComponent from './components/Questionnaire'

import { Content, StyledHeading, StyledSubHeading, Wrapper } from './styled'
import * as constants from './constants'

const submitAnswer = (
  sessionUuid: string,
  questionUuid: string,
  value: any
): Promise<Answer> =>
  fetch(`${configuration.QA_QUESTIONS_ENDPOINT}${questionUuid}/answer`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      payload: value,
      session: sessionUuid,
    }),
  }).then((r) => r.json())

const IncidentReplyContainer = () => {
  const { uuid: sessionUuid } = useParams<{ uuid: string }>()
  const [isSubmittingForm, setIsSubmittingForm] = useState(false)
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
    async (answers: { uuid: string; value: any }[]) => {
      setIsSubmittingForm(true)
      // The reply flow only supports a single retrieved question
      const answer = answers[0]

      const files = answers.find((answer) => answer.uuid === 'file-input')
      if (files) {
        // The attachments endpoint only supports single files - each file needs a separate request
        // TODO Error handling
        await Promise.all(
          Array.from(files.value).map((file) => {
            const formData = new FormData()
            formData.append('file', file as File)

            return fetch(
              `${configuration.INCIDENT_PUBLIC_ENDPOINT}${incident?.signal_id}/attachments/`,
              { body: formData, method: 'POST' }
            )
          })
        )
      }

      // return
      if (!answer || !questionnaire) {
        // console.log('no answer or questionnaire')
        return
      }

      const data = await submitAnswer(sessionUuid, answer.uuid, answer.value)

      if (!data.next_question) {
        // console.log('no next question')
        return
      }

      // assume this is the last question and we get the `submit` key back as response
      if (data.next_question.field_type !== FieldType.Submit) {
        // console.log('last question is not of type submit')
        return
      }

      await submitQuestionnaire(
        `${configuration.QA_SESSIONS_ENDPOINT}${session?.uuid}/submit`
      )
      setIsSubmittingForm(false)
    },
    [
      incident?.signal_id,
      questionnaire,
      session?.uuid,
      sessionUuid,
      submitQuestionnaire,
    ]
  )

  useEffect(() => {
    if (sessionUuid) {
      getSession(sessionUuid)
    }
  }, [getSession, sessionUuid])

  useEffect(() => {
    if (!session) {
      return
    }

    const splitLink = session._links['sia:questionnaire'].href.split('/')
    const uuid = splitLink[splitLink.length - 1]

    if (!uuid) {
      return
    }

    getQuestionnaire(uuid)
  }, [session, getQuestionnaire])

  useEffect(() => {
    if (!session) {
      return
    }

    const splitLink = session._links['sia:public-signal'].href.split('/')
    const uuid = splitLink[splitLink.length - 1]

    if (!uuid) {
      return
    }

    getIncident(uuid)
  }, [session, getIncident])

  const formattedDate = useMemo(
    () =>
      incident
        ? format(
            new Date(incident.incident_date_start),
            'dd MMMM yyyy, hh:mm',
            {
              locale: nl,
            }
          ) + ' uur'
        : '',
    [incident]
  )

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

  if (sessionError || questionnaireError || incidentError || submitError) {
    return (
      <Notice
        title={constants.GENERIC_ERROR_TITLE}
        content={constants.GENERIC_ERROR_CONTENT}
      />
    )
  }

  if (!incident || !questionnaire) {
    // no data
    return null
  }

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
