import { useParams } from 'react-router-dom'
import useGetQuestionnaire from 'hooks/api/qa/useGetQuestionnaire'

const IncidentReplyContainer = () => {
  const { uuid } = useParams<{ uuid: string }>()

  const { data, error } = useGetQuestionnaire(uuid)

  return (
    <h1>
      {uuid}
      data: {JSON.stringify(data)}
      error: {JSON.stringify(error)}
    </h1>
  )
}

export default IncidentReplyContainer
