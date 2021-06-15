// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import styled from 'styled-components'
import { subMonths } from 'date-fns'
import { useFetch } from 'hooks'
import { FunctionComponent, useCallback, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import LoadingIndicator from 'components/LoadingIndicator'
import configuration from 'shared/services/configuration/configuration'
import AreaMap from 'components/AreaMap'
import { INCIDENT_URL } from 'signals/incident-management/routes'
import type {
  AreaFeature,
  AreaFeatureCollection,
} from 'components/AreaMap/types'
import type { Incident } from 'types/api/incident'
import Filter from './components/Filter'
import IncidentDetail from './components/IncidentDetail'

const Wrapper = styled.div`
  display: flex;
  height: 100%;
`

const Sidebar = styled.div`
  width: 540px;
  position: relative;
`

export const AreaContainer: FunctionComponent = () => {
  const history = useHistory()
  const { id } = useParams<{ id: string }>()
  const [selection, setSelection] = useState<AreaFeature | null>(null)

  const { data: area, get: getArea } = useFetch<AreaFeatureCollection>()
  const { data: incident, get: getIncident } = useFetch<Incident>()
  const {
    data: selectedIncident,
    get: getSelectedIncident,
    isLoading: isLoadingSelectedIncident,
  } = useFetch<Incident>()

  useEffect(() => {
    getIncident(`${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}`)
    getArea(
      `${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}/context/near/geography`
    )
  }, [getArea, getIncident, id])

  useEffect(() => {
    if (selection) {
      getSelectedIncident(
        `${configuration.INCIDENT_PRIVATE_ENDPOINT}${selection.properties.id}`
      )
    }
  }, [id, selection, getSelectedIncident])

  const handleClose = useCallback(
    () => history.push(`${INCIDENT_URL}/${id}`),
    [history, id]
  )

  const startDate = subMonths(new Date(), 3).toISOString()

  if (!area?.features || !incident) return null

  const incidentSidebar =
    selection && selectedIncident && !isLoadingSelectedIncident ? (
      <IncidentDetail
        incident={selectedIncident}
        onBack={() => setSelection(null)}
      />
    ) : (
      <LoadingIndicator />
    )

  const sidebar = selection ? (
    incidentSidebar
  ) : (
    <Filter
      startDate={startDate}
      subcategory={incident.category?.sub}
      departments={incident.category?.departments}
    />
  )

  return (
    <Wrapper>
      <Sidebar>{sidebar}</Sidebar>
      <AreaMap
        geoData={area}
        onClose={handleClose}
        center={incident.location.geometrie.coordinates}
        selectedFeature={selection}
        onClick={setSelection}
      />
    </Wrapper>
  )
}

export default AreaContainer
