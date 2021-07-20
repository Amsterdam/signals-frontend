import { useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import configuration from 'shared/services/configuration/configuration'
import { Answer } from 'types/api/qa/answer'
import { FieldType } from 'types/api/qa/question'
import { Questionnaire } from 'types/api/qa/questionnaire'
import useGetQuestionnaire from 'hooks/api/qa/useGetQuestionnaire'
import useGetSession from 'hooks/api/qa/useGetSession'
import useGetPublicIncident from 'hooks/api/useGetPublicIncident'
import QuestionnaireComponent from './components/Questionnaire'

const submitAnswer = (
  questionnaire: Questionnaire,
  uuid: string,
  value: any
): Promise<Answer> =>
  fetch(`${configuration.QA_QUESTIONS_ENDPOINT}${uuid}/answer`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      payload: value,
      questionnaire: questionnaire.uuid,
    }),
  }).then((r) => r.json())

const IncidentReplyContainer = () => {
  const { uuid: sessionUuid } = useParams<{ uuid: string }>()

  const { data: session, get: getSession } = useGetSession()
  const {
    data: questionnaire,
    isLoading: questionnaireIsLoading,
    get: getQuestionnaire,
  } = useGetQuestionnaire()

  const {
    data: incident,
    isLoading: incidentIsLoading,
    get: getIncident,
  } = useGetPublicIncident()

  const submit = useCallback(
    async (answers: { uuid: string; value: any }[]) => {
      // hard-coded single question for now
      const answer = answers[0]

      if (!answer || !questionnaire) {
        console.log('no answer or questionnaire')
        return
      }

      const data = await submitAnswer(questionnaire, answer.uuid, answer.value)

      // assume this is the last question and we get the `submit` key back as response
      if (!data.next_question) {
        console.log('no next question')
        return
      }

      if (data.next_question.field_type !== FieldType.Submit) {
        console.log('last question is not of type submit')
        return
      }

      // submit form
      await submitAnswer(questionnaire, data.next_question.uuid, null)
    },
    [questionnaire]
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

  if (incidentIsLoading || questionnaireIsLoading) {
    // loading
    return null
  }

  if (!incident || !questionnaire) {
    // no data
    return null
  }

  return (
    <>
      <h1>Aanvullende informatie</h1>
      <strong>Uw melding</strong>
      Nummer: {incident._display}: {incident.incident_date_start}
      <QuestionnaireComponent onSubmit={submit} questionnaire={questionnaire} />
    </>
  )
}

export default IncidentReplyContainer
