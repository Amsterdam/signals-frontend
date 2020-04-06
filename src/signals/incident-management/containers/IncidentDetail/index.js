import React, { Fragment, useReducer, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { Row, Column } from '@datapunt/asc-ui';
import styled from 'styled-components';

import configuration from 'shared/services/configuration/configuration';
import LoadingIndicator from 'shared/components/LoadingIndicator';
import History from 'components/History';
import useFetch from 'hooks/useFetch';

import './style.scss';

import DetailHeader from './components/DetailHeader';
import MetaList from './components/MetaList';
import AddNote from './components/AddNote';
import LocationForm from './components/LocationForm';
import AttachmentViewer from './components/AttachmentViewer';
import StatusForm from './components/StatusForm';
import Detail from './components/Detail';
// import SplitNotificationBar from './components/SplitNotificationBar';
import LocationPreview from './components/LocationPreview';
import CloseButton from './components/CloseButton';

const StyledRow = styled(Row)`
  position: relative;
`;

const DetailContainer = styled(Column)`
  flex-direction: column;
  position: relative;
  z-index: 1;
`;

const reducer = (state, action) => {
  switch (action.type) {
    case 'closeAll':
      return { ...state, preview: '', attachment: '' };

    case 'showImage':
      return { ...state, preview: action.type, attachment: action.payload };

    default:
      return { ...state, preview: action.type, attachment: '' };
  }
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
  const [state, dispatch] = useReducer(reducer, {
    preview: previewState,
    attachment: attachmentHref,
  });
  const { id } = useParams();
  const {
    isLoading: incidentIsLoading,
    isSuccess: patchIncidentSuccess,
    error,
    get: getIncident,
    data: incident,
    patch: patchIncident,
  } = useFetch();
  const { get: getHistory, data: history, isLoading: historyIsLoading } = useFetch();
  const { get: getAttachments, data: attachments, isLoading: attachmentsIsLoading } = useFetch();
  const { get: getDefaultTexts, data: defaultTexts, isLoading: defaultTextsIsLoading } = useFetch();
  const isLoading = incidentIsLoading || historyIsLoading || attachmentsIsLoading || defaultTextsIsLoading;

  useEffect(() => {
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keyup', handleKeyUp);
    };
    // Disabling linter; just needs to execute on mount
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!id) return;

    getIncident(`${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}`);

    // disabling linter; only need to update when the id changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (!incident) return;

    const { main_slug, sub_slug } = incident.category;

    getDefaultTexts(`${configuration.TERMS_ENDPOINT}${main_slug}/sub_categories/${sub_slug}/status-message-templates`);
    getHistory(`${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}/history`);
    getAttachments(`${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}/attachments`);
    // disabling linter; only need to update when the incident changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incident]);

  useEffect(() => {
    if (patchIncidentSuccess) {
      dispatch({ type: 'closeAll' });
    }
  }, [patchIncidentSuccess]);

  const handleKeyUp = useCallback(event => {
    switch (event.key) {
      case 'Esc':
      case 'Escape':
        dispatch({ type: 'closeAll' });
        break;

      default:
        break;
    }
  }, []);

  const onPatchIncident = useCallback(
    ({ patch }) => {
      const patchData = { id: incident.id, ...patch };

      patchIncident(`${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}`, patchData);
    },
    [id, incident, patchIncident]
  );

  if (!incident) return null;

  return (
    <Fragment>
      {isLoading && <LoadingIndicator />}

      <Row>
        <Column span={12}>
          <DetailHeader incident={incident} baseUrl="/manage" onPatchIncident={onPatchIncident} />
        </Column>
      </Row>

      <StyledRow>
        {state.preview && <CloseButton onClick={() => dispatch({ type: 'closeAll' })} />}

        <DetailContainer span={7}>
          <Detail
            incident={incident}
            attachments={attachments && attachments.results}
            onShowLocation={() => dispatch({ type: 'showLocation' })}
            onEditLocation={() => dispatch({ type: 'editLocation' })}
            onShowAttachment={payload => dispatch({ type: 'showImage', payload })}
          />

          <AddNote id={id} onPatchIncident={onPatchIncident} />

          {history && <History list={history} />}
        </DetailContainer>

        <DetailContainer span={4} push={1}>
          <MetaList
            incident={incident}
            onPatchIncident={onPatchIncident}
            onEditStatus={() => dispatch({ type: 'editStatus' })}
          />
        </DetailContainer>

        {state.preview && (
          <Preview>
            {state.preview === 'editStatus' && (
              <StatusForm
                defaultTexts={defaultTexts}
                error={error}
                incident={incident}
                onClose={() => dispatch({ type: 'closeAll' })}
                onPatchIncident={onPatchIncident}
              />
            )}

            {state.preview === 'showLocation' && (
              <LocationPreview location={incident.location} onEditLocation={() => dispatch({ type: 'editLocation' })} />
            )}

            {state.preview === 'editLocation' && (
              <LocationForm
                error={error}
                incident={incident}
                onClose={() => dispatch({ type: 'closeAll' })}
                onDismissError={() => {}}
                onPatchIncident={onPatchIncident}
              />
            )}

            {state.preview === 'showImage' && (
              <AttachmentViewer
                attachments={attachments && attachments.results}
                href={state.attachment}
                onShowAttachment={payload => dispatch({ type: 'showImage', payload })}
              />
            )}
          </Preview>
        )}
      </StyledRow>
    </Fragment>
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
