import React, { useReducer, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Column } from '@amsterdam/asc-ui';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import configuration from 'shared/services/configuration/configuration';
import History from 'components/History';
import { useFetch, useEventEmitter } from 'hooks';
import { showGlobalNotification } from 'containers/App/actions';
import { VARIANT_ERROR, TYPE_LOCAL } from 'containers/Notification/constants';
import { getErrorMessage } from 'shared/services/api/api';
import { patchIncidentSuccess } from 'signals/incident-management/actions';

import ChildIncidents from './components/ChildIncidents';
import DetailHeader from './components/DetailHeader';
import MetaList from './components/MetaList';
import AddNote from './components/AddNote';
import LocationForm from './components/LocationForm';
import AttachmentViewer from './components/AttachmentViewer';
import StatusForm from './components/StatusForm';
import Detail from './components/Detail';
import LocationPreview from './components/LocationPreview';
import CloseButton from './components/CloseButton';
import IncidentDetailContext from './context';
import reducer, { initialState } from './reducer';
import {
  CLOSE_ALL,
  EDIT,
  PATCH_START,
  PATCH_SUCCESS,
  PREVIEW,
  RESET,
  SET_ATTACHMENTS,
  SET_CHILDREN,
  SET_DEFAULT_TEXTS,
  SET_ERROR,
  SET_HISTORY,
  SET_INCIDENT,
} from './constants';

const StyledRow = styled(Row)`
  position: relative;
`;

const DetailContainer = styled(Column)`
  flex-direction: column;
  position: relative;
  z-index: 1;
  justify-content: flex-start;
`;

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
`;

const IncidentDetail = () => {
  const { emit, listenFor, unlisten } = useEventEmitter();
  const storeDispatch = useDispatch();
  const { id } = useParams();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { error, get: getIncident, data: incident, isSuccess, patch } = useFetch();
  const { get: getHistory, data: history } = useFetch();
  const { get: getAttachments, data: attachments } = useFetch();
  const { get: getDefaultTexts, data: defaultTexts } = useFetch();
  const { get: getChildren, data: children } = useFetch();

  useEffect(() => {
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyUp, listenFor, unlisten]);

  useEffect(() => {
    dispatch({ type: SET_ERROR, payload: error });

    if (error) {
      const title = error.status === 401 || error.status === 403 ? 'Geen bevoegdheid' : 'Bewerking niet mogelijk';
      const message = getErrorMessage(error, 'Deze wijziging is niet toegestaan in deze situatie.');

      storeDispatch(
        showGlobalNotification({
          title,
          message,
          variant: VARIANT_ERROR,
          type: TYPE_LOCAL,
        })
      );
    }
  }, [error, storeDispatch]);

  useEffect(() => {
    if (!history) return;

    dispatch({ type: SET_HISTORY, payload: history });
  }, [history]);

  useEffect(() => {
    if (!attachments) return;

    dispatch({ type: SET_ATTACHMENTS, payload: attachments?.results });
  }, [attachments]);

  useEffect(() => {
    if (!defaultTexts) return;

    dispatch({ type: SET_DEFAULT_TEXTS, payload: defaultTexts });
  }, [defaultTexts]);

  useEffect(() => {
    if (!children) return;

    dispatch({ type: SET_CHILDREN, payload: children });
  }, [children]);

  useEffect(() => {
    if (!id) return;

    dispatch({ type: RESET });
    getIncident(`${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}`);
  }, [getIncident, id]);

  useEffect(() => {
    if (!isSuccess || !state.patching) return;

    emit('highlight', { type: state.patching });
    dispatch({ type: PATCH_SUCCESS, payload: state.patching });
    storeDispatch(patchIncidentSuccess());
  }, [isSuccess, state.patching, emit, storeDispatch]);

  useEffect(() => {
    if (!incident) return;
    dispatch({ type: SET_INCIDENT, payload: incident });

    retrieveUnderlyingData();
  }, [incident, retrieveUnderlyingData]);

  const retrieveUnderlyingData = useCallback(() => {
    const { main_slug, sub_slug } = incident.category;

    getHistory(`${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}/history`);

    // retrieve default texts only once per page load
    if (!state.defaultTexts) {
      getDefaultTexts(
        `${configuration.TERMS_ENDPOINT}${main_slug}/sub_categories/${sub_slug}/status-message-templates`
      );
    }

    // retrieve attachments only once per page load
    if (!state.attachments) {
      getAttachments(`${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}/attachments`);
    }

    // retrieve children only when an incident has children
    const hasChildren = incident?._links['sia:children']?.length > 0;

    if (hasChildren) {
      getChildren(`${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}/children/`);
    }
  }, [
    getAttachments,
    getChildren,
    getDefaultTexts,
    getHistory,
    id,
    incident,
    state.attachments,
    state.defaultTexts,
  ]);

  const handleKeyUp = useCallback(
    event => {
      switch (event.key) {
        case 'Esc':
        case 'Escape':
          closeDispatch();
          break;

        default:
          break;
      }
    },
    [closeDispatch]
  );

  const updateDispatch = useCallback(
    action => {
      dispatch({ type: PATCH_START, payload: action.type });
      patch(`${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}`, action.patch);
    },
    [id, patch]
  );

  const previewDispatch = useCallback((section, payload) => {
    dispatch({ type: PREVIEW, payload: { preview: section, ...payload } });
  }, []);

  const editDispatch = useCallback((section, payload) => {
    dispatch({ type: EDIT, payload: { edit: section, ...payload } });
  }, []);

  const closeDispatch = useCallback(() => {
    dispatch({ type: CLOSE_ALL });
  }, []);

  if (!state.incident) return null;

  return (
    <IncidentDetailContext.Provider
      value={{
        incident: state.incident,
        update: updateDispatch,
        preview: previewDispatch,
        edit: editDispatch,
        close: closeDispatch,
      }}
    >
      <Row data-testid="incidentDetail">
        <Column span={12}>
          <DetailHeader />
        </Column>
      </Row>

      <StyledRow>
        <DetailContainer span={{ small: 1, medium: 2, big: 5, large: 7, xLarge: 7 }}>
          <Detail attachments={state.attachments} />

          <AddNote />

          {state.children && <ChildIncidents incidents={state.children.results} parent={state.incident} />}

          {state.history && <History list={state.history} />}
        </DetailContainer>

        <DetailContainer
          span={{ small: 1, medium: 2, big: 3, large: 4, xLarge: 4 }}
          push={{ small: 0, medium: 0, big: 0, large: 1, xLarge: 1 }}
        >
          <MetaList />
        </DetailContainer>

        {(state.preview || state.edit) && (
          <Preview>
            {state.edit === 'status' && (
              <StatusForm defaultTexts={state.defaultTexts} childIncidents={state.children?.results} />
            )}

            {state.preview === 'location' && <LocationPreview />}

            {state.edit === 'location' && <LocationForm />}

            {state.preview === 'attachment' && (
              <AttachmentViewer attachments={state.attachments} href={state.attachmentHref} />
            )}
          </Preview>
        )}
        {state.preview && <CloseButton aria-label="Sluiten" onClick={closeDispatch} />}
      </StyledRow>
    </IncidentDetailContext.Provider>
  );
};

export default IncidentDetail;
