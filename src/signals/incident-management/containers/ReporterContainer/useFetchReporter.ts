// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { showGlobalNotification } from 'containers/App/actions'
import { TYPE_LOCAL, VARIANT_ERROR } from 'containers/Notification/constants'
import useFetch from 'hooks/useFetch'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import configuration from 'shared/services/configuration/configuration'
import Reporter from 'types/api/reporter'
import type { Incident as IncidentType } from '../IncidentDetail/types'
import { Incident, Incidents } from './types'

export const PAGE_SIZE = 10

export interface FetchReporterHook {
  selectIncident: (id: number) => void
  incident: Incident
  incidents: Incidents
  currentPage: number
  setCurrentPage: (page: number) => void
}

export const useFetchReporter = (id: string): FetchReporterHook => {
  const storeDispatch = useDispatch()
  const [selectedIncidentId, setSelectedIncidentId] = useState<number>()
  const [currentPage, setCurrentPage] = useState(1)

  const {
    get: getReporter,
    data: getReporterData,
    error: getReporterError,
    isLoading: getReporterLoading,
  } = useFetch<Reporter>()

  const {
    get: getSelectedIncident,
    error: getSelectedIncidentError,
    isLoading: getSelectedIncidentLoading,
    data: getSelectedIncidentData,
  } = useFetch<IncidentType>()

  const incident = useMemo<Incident>(
    () => ({
      isLoading: getSelectedIncidentLoading,
      data: getSelectedIncidentData && {
        id: getSelectedIncidentData.id,
        text: getSelectedIncidentData?.text,
        email: getSelectedIncidentData?.reporter?.email,
      },
    }),
    [getSelectedIncidentData, getSelectedIncidentLoading]
  )

  const incidents = useMemo<Incidents>(
    () => ({
      isLoading: getReporterLoading,
      data: getReporterData && {
        count: getReporterData.count,
        list: getReporterData.results.map((result) => ({
          id: result.id,
          category: result.category.sub,
          feedback: result.feedback
            ? {
                isSatisfied: result.feedback?.is_satisfied,
                submittedAt: result.feedback?.submitted_at,
              }
            : null,
          createdAt: result.created_at,
          hasChildren: result.has_children,
          status: result.status.state_display,
        })),
      },
    }),
    [getReporterData, getReporterLoading]
  )
  useEffect(() => {
    getReporter(
      `${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}/context/reporter?page=${currentPage}&page_size=${PAGE_SIZE}`
    )
  }, [getReporter, id, currentPage])

  useEffect(() => {
    setSelectedIncidentId(getReporterData?.results[0]?.id)
  }, [getReporterData])

  useEffect(() => {
    if (selectedIncidentId) {
      getSelectedIncident(
        `${configuration.INCIDENT_PRIVATE_ENDPOINT}${selectedIncidentId}`
      )
    }
  }, [getSelectedIncident, selectedIncidentId])

  useEffect(() => {
    if (getReporterError || getSelectedIncidentError) {
      storeDispatch(
        showGlobalNotification({
          title:
            'De data kon niet opgehaald worden. probeer het later nog eens.',
          variant: VARIANT_ERROR,
          type: TYPE_LOCAL,
        })
      )
    }
  }, [getReporterError, storeDispatch, getSelectedIncidentError])

  return {
    selectIncident: setSelectedIncidentId,
    incident,
    incidents,
    currentPage,
    setCurrentPage,
  }
}
