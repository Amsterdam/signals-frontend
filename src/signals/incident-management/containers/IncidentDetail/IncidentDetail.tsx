// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2022 Gemeente Amsterdam, Vereniging van Nederlandse Gemeenten
import { useReducer, useEffect, useCallback, useState } from 'react'

import { themeSpacing, Row, Column } from '@amsterdam/asc-ui'
import CloseButton from 'components/CloseButton'
import History from 'components/History'
import { showGlobalNotification } from 'containers/App/actions'
import { VARIANT_ERROR, TYPE_LOCAL } from 'containers/Notification/constants'
import { useFetch, useEventEmitter, useFetchAll } from 'hooks'
import { makeSelectSubCategories } from 'models/categories/selectors'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getErrorMessage } from 'shared/services/api/api'
import configuration from 'shared/services/configuration/configuration'
import { patchIncidentSuccess } from 'signals/incident-management/actions'
import styled from 'styled-components'
import type { DefaultTexts } from 'types/api/default-text'
import type { Incident } from 'types/api/incident'
import type Context from 'types/context'

import Attachments from './components/Attachments'
import AttachmentViewer from './components/AttachmentViewer'
import ChildIncidents from './components/ChildIncidents'
import Detail from './components/Detail'
import DetailHeader from './components/DetailHeader'
import ForwardToExternal from './components/ForwardToExternal'
import LocationForm from './components/LocationForm'
import LocationPreview from './components/LocationPreview'
import MetaList from './components/MetaList'
import {
  CLOSE_ALL,
  EDIT,
  EXTERNAL,
  PATCH_START,
  PATCH_SUCCESS,
  PREVIEW,
  RESET,
  SET_ATTACHMENTS,
  SET_CHILDREN,
  SET_CHILDREN_HISTORY,
  SET_CHILD_INCIDENTS,
  SET_CONTEXT,
  SET_DEFAULT_TEXTS,
  SET_ERROR,
  SET_HISTORY,
  SET_INCIDENT,
} from './constants'
import IncidentDetailContext from './context'
import useUpload from './hooks/useUpload'
import reducer, { initialState } from './reducer'
import type { Attachment, HistoryEntry, IncidentChild, Result } from './types'

const StyledRow = styled(Row)`
  position: relative;
`

const StyledAttachments = styled(Attachments)`
  margin-bottom: ${themeSpacing(4)};
`

const DetailContainer = styled(Column)`
  flex-direction: column;
  position: relative;
  z-index: 1;
  justify-content: flex-start;
`

const Preview = styled.div`
  background: white;
  bottom: 0;
  height: 100%;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
  z-index: 1;
`

const IncidentDetail = () => {
  const { emit, listenFor, unlisten } = useEventEmitter()
  const storeDispatch = useDispatch()
  const { id } = useParams<{ id: string }>()
  const [isRemovingAttachment, setRemovingAttachment] = useState(false)
  const [isParent, setIsParent] = useState(false)
  const [isChild, setIsChild] = useState(false)
  const [showAttachmentViewer, setShowAttachmentViewer] = useState(false)
  const [state, dispatch] = useReducer(reducer, initialState)
  const {
    error,
    get: getIncident,
    data: incident,
    isSuccess,
    patch,
  } = useFetch<Incident>()
  const { get: getHistory, data: history } = useFetch<HistoryEntry[]>()
  const {
    get: getAttachments,
    data: attachments,
    isLoading: isAttachmentsLoading,
  } = useFetch<Result<Attachment>>()
  const {
    del: deleteAttachment,
    isLoading: isDeleteAttachmentLoading,
    isSuccess: isDeleteAttachmentSuccess,
  } = useFetch()
  const { get: getDefaultTexts, data: defaultTexts } = useFetch<DefaultTexts>()
  const { get: getChildren, data: children } = useFetch<Result<IncidentChild>>()
  const { get: getChildrenHistory, data: childrenHistory } =
    useFetchAll<HistoryEntry[]>()
  const { get: getContext, data: context } = useFetch<Context>()
  const { get: getChildIncidents, data: childIncidents } =
    useFetchAll<Incident>()
  const { upload, uploadSuccess, uploadProgress, uploadError } = useUpload()

  const subcategories = useSelector(makeSelectSubCategories)
  const closeDispatch = () => dispatch({ type: CLOSE_ALL })

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case 'Esc':
      case 'Escape':
        closeDispatch()
        break

      default:
        break
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [handleKeyUp, listenFor, unlisten])

  useEffect(() => {
    dispatch({ type: SET_ERROR, payload: error })

    if (error) {
      const fetchError = error as Response
      const title =
        fetchError?.status === 401 || fetchError.status === 403
          ? 'Geen bevoegdheid'
          : 'Bewerking niet mogelijk'
      const message = getErrorMessage(
        error,
        'Deze wijziging is niet toegestaan in deze situatie.'
      )

      storeDispatch(
        showGlobalNotification({
          title,
          message,
          variant: VARIANT_ERROR,
          type: TYPE_LOCAL,
        })
      )
    }
  }, [error, storeDispatch])

  useEffect(() => {
    if (!history) return

    dispatch({ type: SET_HISTORY, payload: history })
  }, [history])

  useEffect(() => {
    if (!attachments?.results) return

    dispatch({ type: SET_ATTACHMENTS, payload: attachments })
  }, [attachments])

  useEffect(() => {
    if (!incident?.category) return

    const { main_slug, sub_slug } = incident.category
    getDefaultTexts(
      `${configuration.TERMS_ENDPOINT}${main_slug}/sub_categories/${sub_slug}/status-message-templates`
    )
  }, [incident?.category, getDefaultTexts])

  useEffect(() => {
    if (!defaultTexts) return

    dispatch({ type: SET_DEFAULT_TEXTS, payload: defaultTexts })
  }, [defaultTexts])

  useEffect(() => {
    if (!children) return

    dispatch({ type: SET_CHILDREN, payload: children })
  }, [children])

  useEffect(() => {
    if (!childrenHistory) return

    dispatch({ type: SET_CHILDREN_HISTORY, payload: childrenHistory })
  }, [childrenHistory])

  useEffect(() => {
    if (!childIncidents) return

    dispatch({ type: SET_CHILD_INCIDENTS, payload: childIncidents })
  }, [childIncidents])

  useEffect(() => {
    if (!context) return

    dispatch({ type: SET_CONTEXT, payload: context })
  }, [context])

  useEffect(() => {
    if (!id) return

    dispatch({ type: RESET })
    getIncident(`${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}`)
  }, [getIncident, id])

  const retrieveUnderlyingData = useCallback(() => {
    getHistory(`${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}/history`)

    if (!state.attachments) {
      getAttachments(
        `${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}/attachments`
      )
    }

    const isParent = Boolean(incident?._links['sia:children'])
    setIsParent(isParent)
    const isChild = Boolean(incident?._links['sia:parent'])
    setIsChild(isChild)

    if (isParent) {
      getChildren(`${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}/children/`)
    }

    getContext(`${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}/context`)
  }, [
    getHistory,
    id,
    state.attachments,
    incident?._links,
    getAttachments,
    getChildren,
    getContext,
  ])

  useEffect(() => {
    if (!isSuccess || !state.patching) return

    emit('highlight', { type: state.patching })
    dispatch({ type: PATCH_SUCCESS, payload: state.patching })
    storeDispatch(patchIncidentSuccess())
  }, [isSuccess, state.patching, emit, storeDispatch])

  useEffect(() => {
    if (!incident) return
    dispatch({ type: SET_INCIDENT, payload: incident })

    retrieveUnderlyingData()
  }, [incident, retrieveUnderlyingData])

  useEffect(() => {
    if (children?.results && children.results?.length > 0) {
      const viewableResults = children.results.filter(
        (result) => result.can_view_signal
      )

      const childIncidentUrls = viewableResults?.map(
        ({ id: childId }) =>
          `${configuration.INCIDENT_PRIVATE_ENDPOINT}${childId}`
      )
      const childrenHistoryUrls = viewableResults?.map(
        ({ id: childId }) =>
          `${configuration.INCIDENT_PRIVATE_ENDPOINT}${childId}/history`
      )

      getChildrenHistory(childrenHistoryUrls)
      getChildIncidents(childIncidentUrls)
    }
  }, [children, getChildrenHistory, getChildIncidents])

  const updateDispatch = useCallback(
    (action) => {
      dispatch({ type: PATCH_START, payload: action.type })
      patch(`${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}`, action.patch)
    },
    [id, patch]
  )

  const previewDispatch = useCallback((section, payload) => {
    dispatch({ type: PREVIEW, payload: { preview: section, ...payload } })
  }, [])

  const editDispatch = useCallback((section, payload) => {
    dispatch({ type: EDIT, payload: { edit: section, ...payload } })
  }, [])

  const toggleExternalDispatch = useCallback(() => {
    dispatch({ type: EXTERNAL, payload: {} })
  }, [])

  const addAttachment = useCallback(
    (files) => {
      if (incident) {
        upload(files, incident.id)
      }
    },
    [incident, upload]
  )

  const removeAttachment = useCallback(
    (attachment) => {
      deleteAttachment(attachment._links.self.href)
    },
    [deleteAttachment]
  )

  useEffect(() => {
    if (
      uploadSuccess ||
      (!isDeleteAttachmentLoading && isDeleteAttachmentSuccess)
    ) {
      getHistory(`${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}/history`)
      getAttachments(
        `${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}/attachments`
      )
    }
  }, [
    getAttachments,
    getHistory,
    id,
    uploadSuccess,
    isDeleteAttachmentSuccess,
    isDeleteAttachmentLoading,
  ])

  useEffect(() => {
    if (isAttachmentsLoading || isDeleteAttachmentLoading)
      setRemovingAttachment(true)
  }, [isAttachmentsLoading, isDeleteAttachmentLoading])

  useEffect(() => {
    if (!isAttachmentsLoading) setRemovingAttachment(false)
  }, [isAttachmentsLoading])

  useEffect(() => {
    setShowAttachmentViewer(
      Boolean(
        state.preview === 'attachment' &&
          state.attachments &&
          state.attachmentHref
      )
    )
  }, [state.attachmentHref, state.attachments, state.preview])

  const onCloseAttachmentViewer = useCallback(() => {
    setShowAttachmentViewer(false)
    closeDispatch()
  }, [setShowAttachmentViewer])

  if (!state.incident || !subcategories) return null

  return (
    <IncidentDetailContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        incident: state?.incident,
        update: updateDispatch,
        preview: previewDispatch,
        edit: editDispatch,
        close: closeDispatch,
        attachments: state?.attachments,
        toggleExternal: toggleExternalDispatch,
      }}
    >
      <Row data-testid="incidentDetail">
        <Column span={12}>
          <DetailHeader />
        </Column>
      </Row>

      <StyledRow>
        <DetailContainer
          span={{ small: 1, medium: 2, big: 5, large: 7, xLarge: 7 }}
        >
          <Detail context={state.context} />

          <StyledAttachments
            attachments={state.attachments?.results ?? []}
            add={addAttachment}
            remove={removeAttachment}
            isChildIncident={isChild}
            isParentIncident={isParent}
            isRemoving={isRemovingAttachment}
            uploadProgress={uploadProgress}
            uploadError={uploadError}
          />

          {state.children?.results && state.childrenHistory && (
            <ChildIncidents
              childrenList={state.children.results}
              parent={state.incident}
              history={state.childrenHistory}
              childIncidents={state.childIncidents}
            />
          )}

          {state.history && <History list={state.history} />}
        </DetailContainer>

        <DetailContainer
          span={{ small: 4, medium: 4, big: 4, large: 5, xLarge: 5 }}
          push={{ small: 0, medium: 0, big: 0, large: 0, xLarge: 0 }}
        >
          {state.external ? (
            <ForwardToExternal onClose={toggleExternalDispatch} />
          ) : (
            <MetaList
              defaultTexts={state.defaultTexts}
              childIncidents={state.children?.results}
            />
          )}
        </DetailContainer>

        {((!showAttachmentViewer && state.preview) || state.edit) && (
          <Preview>
            {state.preview === 'location' && <LocationPreview />}

            {state.edit === 'location' && <LocationForm />}
          </Preview>
        )}
        {!showAttachmentViewer && state.preview && (
          <CloseButton close={closeDispatch} aria-label="Sluiten" />
        )}
      </StyledRow>
      {showAttachmentViewer && (
        <AttachmentViewer
          attachments={state.attachments?.results || []}
          href={state.attachmentHref || ''}
          onClose={onCloseAttachmentViewer}
        />
      )}
    </IncidentDetailContext.Provider>
  )
}

export default IncidentDetail
