// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { useFetch } from 'hooks'
import { FunctionComponent, useCallback, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import configuration from 'shared/services/configuration/configuration'
import AreaMap from 'components/AreaMap'
import { INCIDENT_URL } from 'signals/incident-management/routes'

import type {
  AreaFeature,
  AreaFeatureCollection,
} from 'components/AreaMap/types'
import type { Incident } from 'types/incident'

export const AreaContainer: FunctionComponent = () => {
  const history = useHistory()
  const { id } = useParams<{ id: string }>()
  const [selection, setSelection] = useState<AreaFeature | null>(null)

  const { data: area, get: getArea } = useFetch<AreaFeatureCollection>()
  const { data: incident, get: getIncident } = useFetch<Incident>()

  useEffect(() => {
    getIncident(`${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}`)
    getArea(
      `${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}/context/near/geography`
    )
  }, [getArea, getIncident, id])

  const handleClose = useCallback(() => history.push(`${INCIDENT_URL}/${id}`), [
    history,
    id,
  ])

  if (!area?.features || !incident) return null

  return (
    <AreaMap
      geoData={area}
      onClose={handleClose}
      center={incident.location.geometrie.coordinates}
      selectedFeature={selection}
      onClick={setSelection}
    />
  )
}

export default AreaContainer
