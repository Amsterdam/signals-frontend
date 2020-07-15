import React, { useReducer, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { Row, Column } from '@datapunt/asc-ui';
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

const StyledRow = styled(Row)`
  position: relative;
`;

const DetailContainer = styled(Column)`
  flex-direction: column;
  position: relative;
  z-index: 1;
  justify-content: flex-start;
`;

const reducer = (state, action) => {
  // disabling linter; default case does not apply, because all actions are known
  // eslint-disable-next-line default-case
  switch (action.type) {
    case 'closeAll':
      return { ...state, preview: undefined, edit: undefined, error: undefined, attachmentHref: '' };

    case 'error':
      return { ...state, error: action.payload };

    case 'attachments':
      return { ...state, attachments: action.payload };

    case 'history':
      return { ...state, history: action.payload };

    case 'defaultTexts':
      return { ...state, defaultTexts: action.payload };

    case 'incident':
      return { ...state, incident: { ...state.incident, ...action.payload } };

    case 'patchStart':
      return { ...state, patching: action.payload };

    case 'patchSuccess':
      return { ...state, patching: undefined };

    case 'preview':
      return { ...state, edit: undefined, ...action.payload };

    case 'edit':
      return { ...state, preview: undefined, ...action.payload };
  }

  return state;
};

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

const IncidentDetail = ({ attachmentHref, previewState }) => {
  const { emit, listenFor, unlisten } = useEventEmitter();
  const storeDispatch = useDispatch();
  const { id } = useParams();
  const [state, dispatch] = useReducer(reducer, {
    attachmentHref,
    attachments: undefined,
    error: undefined,
    history: undefined,
    incident: undefined,
    preview: previewState,
    patching: undefined,
  });
  const { error, get: getIncident, data: incident, isSuccess, patch } = useFetch();
  const { get: getHistory, data: history } = useFetch();
  const { get: getAttachments, data: attachments } = useFetch();
  const { get: getDefaultTexts, data: defaultTexts } = useFetch();

  useEffect(() => {
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyUp, listenFor, unlisten]);

  useEffect(() => {
    dispatch({ type: 'error', payload: error });

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

    dispatch({ type: 'history', payload: history });
  }, [history]);

  useEffect(() => {
    if (!attachments) return;

    dispatch({ type: 'attachments', payload: attachments?.results });
  }, [attachments]);

  useEffect(() => {
    if (!defaultTexts) return;

    dispatch({ type: 'defaultTexts', payload: defaultTexts });
  }, [defaultTexts]);

  useEffect(() => {
    if (!id) return;

    getIncident(`${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}`);

    // disabling linter; only need to update when the id changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (!isSuccess || !state.patching) return;

    emit('highlight', { type: state.patching });
    dispatch({ type: 'patchSuccess', payload: state.patching });
    storeDispatch(patchIncidentSuccess());
  }, [isSuccess, state.patching, emit, storeDispatch]);

  useEffect(() => {
    if (!incident) return;

    dispatch({ type: 'incident', payload: incident });

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
  }, [getHistory, getAttachments, getDefaultTexts, state.attachments, state.defaultTexts, id, incident]);

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
      dispatch({ type: 'patchStart', payload: action.type });
      patch(`${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}`, action.patch);
    },
    [id, patch]
  );

  const previewDispatch = useCallback((section, payload) => {
    dispatch({ type: 'preview', payload: { preview: section, ...payload } });
  }, []);

  const editDispatch = useCallback((section, payload) => {
    dispatch({ type: 'edit', payload: { edit: section, ...payload } });
  }, []);

  const closeDispatch = useCallback(() => {
    dispatch({ type: 'closeAll' });
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

          <ChildIncidents />

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
            {state.edit === 'status' && <StatusForm defaultTexts={state.defaultTexts} error={state.error} />}

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

IncidentDetail.defaultProps = {
  previewState: '',
  attachmentHref: '',
};

IncidentDetail.propTypes = {
  previewState: PropTypes.string,
  attachmentHref: PropTypes.string,
};

export default IncidentDetail;
