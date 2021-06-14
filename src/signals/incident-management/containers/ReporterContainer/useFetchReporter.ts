// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { showGlobalNotification } from 'containers/App/actions'
import { TYPE_LOCAL, VARIANT_ERROR } from 'containers/Notification/constants'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import useGetContextReporter from 'hooks/api/useGetContextReporter'
import useGetIncident from 'hooks/api/useGetIncident'
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
    data: getReporterData,
    error: getReporterError,
    isLoading: getReporterLoading,
  } = useGetContextReporter(Number(id), {
    page: currentPage,
    pageSize: PAGE_SIZE,
  })

  const incidents = useMemo<Incidents>(
    () => ({
      isLoading: getReporterLoading,
      data: getReporterData && {
        count: getReporterData.count,
        list: getReporterData.results.map((result) => ({
          id: result.id,
          canView: result.can_view_signal,
          category: result.category.sub,
          feedback: result.feedback
            ? {
                isSatisfied: result.feedback.is_satisfied,
                submittedAt: result.feedback.submitted_at,
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

  const canView = useMemo(
    () =>
      incidents.data?.list.find((item) => item.id === selectedIncidentId)
        ?.canView,
    [incidents.data?.list, selectedIncidentId]
  )

  const {
    error: getSelectedIncidentError,
    isLoading: getSelectedIncidentLoading,
    data: getSelectedIncidentData,
  } = useGetIncident(canView ? selectedIncidentId : undefined)

  const incident = useMemo<Incident>(
    () => ({
      isLoading: getSelectedIncidentLoading,
      data: getSelectedIncidentData,
      id: selectedIncidentId,
      canView,
    }),
    [
      canView,
      getSelectedIncidentData,
      getSelectedIncidentLoading,
      selectedIncidentId,
    ]
  )

  useEffect(() => {
    setSelectedIncidentId(getReporterData?.results[0]?.id)
  }, [getReporterData])

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
