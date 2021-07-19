import { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import useGetQuestionnaire from 'hooks/api/qa/useGetQuestionnaire'
import useGetSession from 'hooks/api/qa/useGetSession'
import useGetPublicIncident from 'hooks/api/useGetPublicIncident'
import Questionnaire from './components/Questionnaire'
import Notice from './components/Notice/Notice'
import * as constants from './constants'

const IncidentReplyContainer = () => {
  const { uuid: sessionUuid } = useParams<{ uuid: string }>()

  const {
    data: session,
    get: getSession,
    error: sessionError,
  } = useGetSession()

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

  const isExpired = useMemo(
    () =>
      sessionError &&
      typeof sessionError !== 'boolean' &&
      (sessionError as Response).status === constants.EXPIRED_STATUS,
    [sessionError]
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

  if (isExpired)
    return (
      <Notice
        title={constants.EXPIRED_TITLE}
        content={constants.EXPIRED_CONTENT}
      />
    )

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
      <Questionnaire onSubmit={() => {}} questionnaire={questionnaire} />
    </>
  )
}

export default IncidentReplyContainer
