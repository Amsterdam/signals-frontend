import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useGetQuestionnaire from 'hooks/api/qa/useGetQuestionnaire'

const IncidentReplyContainer = () => {
  const { uuid } = useParams<{ uuid: string }>()

  const { data, error, get } = useGetQuestionnaire()

  useEffect(() => {
    if (uuid) {
      get(uuid)
    }
  }, [get, uuid])

  return (
    <h1>
      {uuid}
      data: {JSON.stringify(data)}
      error: {JSON.stringify(error)}
    </h1>
  )
}

export default IncidentReplyContainer
