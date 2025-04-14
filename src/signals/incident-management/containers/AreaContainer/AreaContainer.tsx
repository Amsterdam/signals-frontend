// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021-2023 Gemeente Amsterdam
import type { FunctionComponent } from 'react'
import { useCallback, useState, useEffect } from 'react'

import subWeeks from 'date-fns/subWeeks'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'

import AreaMap from 'components/AreaMap'
import type { Feature } from 'components/AreaMap/types'
import LoadingIndicator from 'components/LoadingIndicator'
import { showGlobalNotification } from 'containers/App/actions'
import { VARIANT_ERROR, TYPE_LOCAL } from 'containers/Notification/constants'
import useGetIncidentContextGeography from 'hooks/api/useGetContextGeography'
import useGetIncident from 'hooks/api/useGetIncident'

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
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [selection, setSelection] = useState<Feature | null>(null)
  const dispatch = useDispatch()

  const {
    data: incident,
    get: getIncident,
    error: incidentError,
  } = useGetIncident()
  const {
    data: area,
    get: getIncidentContextGeography,
    error: contextError,
  } = useGetIncidentContextGeography()

  const {
    data: selectedIncident,
    get: getSelectedIncident,
    isLoading: isLoadingSelectedIncident,
    error: selectedIncidentError,
  } = useGetIncident()

  useEffect(() => {
    if (id) {
      getIncident(Number(id))
    }
  }, [getIncident, id])

  useEffect(() => {
    if (selection) {
      getSelectedIncident(selection.properties.id)
    }
  }, [getSelectedIncident, selection])

  useEffect(() => {
    if (contextError || selectedIncidentError || incidentError) {
      dispatch(
        showGlobalNotification({
          title: 'De data kon niet worden opgehaald',
          variant: VARIANT_ERROR,
          type: TYPE_LOCAL,
        })
      )
    }
  }, [contextError, selectedIncidentError, incidentError, dispatch])

  useEffect(() => {
    if (id) {
      getIncidentContextGeography(Number(id))
    }
  }, [getIncidentContextGeography, id])

  const handleClose = useCallback(() => navigate(-1), [navigate])

  const startDate = subWeeks(new Date(), 12).toISOString()

  if (!area?.features || !incident?.location) return null

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
        location={incident.location}
        selectedFeature={selection}
        onClick={setSelection}
      />
    </Wrapper>
  )
}

export default AreaContainer
