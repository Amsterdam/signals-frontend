// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { showGlobalNotification } from 'containers/App/actions'
import { TYPE_LOCAL, VARIANT_ERROR } from 'containers/Notification/constants'
import useFetch from 'hooks/useFetch'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import configuration from 'shared/services/configuration/configuration'
import { Incident, ReporterContext } from './types'

const PAGE_SIZE = 10

export interface ReporterContextHook {
  selectedIncident?: Incident
  selectedIncidentId?: number
  setSelectedIncidentId: (id: number) => void
  isLoading: boolean
  reporter: {
    originalIncidentId: string
    email?: string
    incidents?: ReporterContext
  }
}

export const useReporterContext = (): ReporterContextHook => {
  const storeDispatch = useDispatch()
  const [selectedIncidentId, setSelectedIncidentId] = useState<number>()
  const { id } = useParams<{ id: string }>()

  const {
    get: getReporterContext,
    data: reporterContext,
    error: getReporterContextError,
    isLoading: getReporterContextLoading,
  } = useFetch<ReporterContext>()

  const {
    get: getIncident,
    data: incident,
    error: getIncidentError,
    isLoading: getIncidentLoading,
  } = useFetch<Incident>()

  const {
    get: getSelectedIncident,
    data: selectedIncident,
  } = useFetch<Incident>()

  useEffect(() => {
    getReporterContext(
      `${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}/context/reporter?page_size=${PAGE_SIZE}`
    )
    getIncident(`${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}`)
  }, [getReporterContext, getIncident, id])

  useEffect(() => {
    setSelectedIncidentId(reporterContext?.results[0]?.id)
  }, [reporterContext])

  useEffect(() => {
    if (selectedIncidentId) {
      getSelectedIncident(
        `${configuration.INCIDENT_PRIVATE_ENDPOINT}${selectedIncidentId}`
      )
    }
  }, [getSelectedIncident, selectedIncidentId])

  useEffect(() => {
    if (getReporterContextError || getIncidentError) {
      storeDispatch(
        showGlobalNotification({
          title:
            'De data kon niet opgehaald worden. probeer het later nog eens.',
          variant: VARIANT_ERROR,
          type: TYPE_LOCAL,
        })
      )
    }
  }, [getReporterContextError, getIncidentError, storeDispatch])

  return {
    selectedIncident,
    selectedIncidentId,
    setSelectedIncidentId,
    isLoading: getReporterContextLoading || getIncidentLoading,
    reporter: {
      originalIncidentId: id,
      email: incident?.reporter.email,
      incidents: reporterContext,
    },
  }
}
