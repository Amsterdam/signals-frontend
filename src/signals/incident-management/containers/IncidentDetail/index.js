import React, { Fragment, useReducer, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { Row, Column } from '@datapunt/asc-ui';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import configuration from 'shared/services/configuration/configuration';
import History from 'components/History';
import useFetch from 'hooks/useFetch';
import { showGlobalNotification } from 'containers/App/actions';
import { VARIANT_ERROR, TYPE_LOCAL } from 'containers/Notification/constants';

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
  switch (action.type) {
    case 'closeAll':
      return { ...state, preview: '', error: undefined, attachmentHref: '' };

    case 'showImage':
      return { ...state, preview: 'showImage', attachmentHref: action.payload };

    case 'error':
      return { ...state, error: action.payload };

    case 'attachments':
      return { ...state, attachments: action.payload };

    case 'defaultTexts':
      return { ...state, defaultTexts: action.payload };

    default:
      return { ...state, preview: action.type, attachmentHref: '' };
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
  const storeDispatch = useDispatch();
  const { id } = useParams();
  const [state, dispatch] = useReducer(reducer, {
    preview: previewState,
    attachmentHref,
    error: undefined,
    attachments: undefined,
  });
  const {
    isSuccess: patchIncidentSuccess,
    error,
    get: getIncident,
    data: incident,
    patch: patchIncident,
  } = useFetch();
  const { get: getHistory, data: history } = useFetch();
  const { get: getAttachments, data: attachments } = useFetch();
  const { get: getDefaultTexts, data: defaultTexts } = useFetch();

  useEffect(() => {
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keyup', handleKeyUp);
    };
    // Disabling linter; just needs to execute on mount
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    dispatch({ type: 'error', payload: error });

    if (error) {
      let title = 'Bewerking niet mogelijk';
      let message;

      switch (error.status) {
        case 500:
          message = 'Een fout op de server heeft voorkomen dat deze actie uitgevoerd kon worden. Probeer het nogmaals.';
          break;

        case 401:
          title = 'Geen bevoegdheid';
          message = 'Voor deze bewerking is een geautoriseerde sessie noodzakelijk';
          break;

        case 403:
          title = 'Geen bevoegdheid';
          message = 'Je bent niet voldoende rechten om deze actie uit te voeren.';
          break;

        case 400:
        default:
          message = 'Deze wijziging is niet toegestaan in deze situatie.';
          break;
      }

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
    dispatch({ type: 'attachments', payload: attachments?.results });
  }, [attachments]);

  useEffect(() => {
    dispatch({ type: 'defaultTexts', payload: defaultTexts });
  }, [defaultTexts]);

  useEffect(() => {
    if (!id) return;

    getIncident(`${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}`);

    // disabling linter; only need to update when the id changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (!incident) return;

    const { main_slug, sub_slug } = incident.category;

    getHistory(`${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}/history`);

    // retrieve default texts only once per page load
    if (!state.defaultTexts) {
      getDefaultTexts(`${configuration.TERMS_ENDPOINT}${main_slug}/sub_categories/${sub_slug}/status-message-templates`);
    }

    // retrieve attachments only once per page load
    if (!state.attachments) {
      getAttachments(`${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}/attachments`);
    }

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
      <Row data-testid="incidentDetail">
        <Column span={12}>
          <DetailHeader
            incidentId={incident.id}
            status={incident?.status?.state}
            links={incident?._links}
            onPatchIncident={onPatchIncident}
          />
        </Column>
      </Row>

      <StyledRow>
        <DetailContainer span={{ small: 1, medium: 2, big: 5, large: 7, xLarge: 7 }}>
          <Detail
            incident={incident}
            attachments={state.attachments}
            onShowLocation={() => dispatch({ type: 'showLocation' })}
            onEditLocation={() => dispatch({ type: 'editLocation' })}
            onShowAttachment={payload => dispatch({ type: 'showImage', payload })}
          />

          <AddNote id={id} onPatchIncident={onPatchIncident} />

          <ChildIncidents incident={incident} />

          {history && <History list={history} />}
        </DetailContainer>

        <DetailContainer
          span={{ small: 1, medium: 2, big: 3, large: 4, xLarge: 4 }}
          push={{ small: 0, medium: 0, big: 0, large: 1, xLarge: 1 }}
        >
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
                defaultTexts={state.defaultTexts}
                error={state.error}
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
                incidentId={incident.id}
                location={incident.location}
                onPatchIncident={onPatchIncident}
                onClose={() => dispatch({ type: 'closeAll' })}
              />
            )}

            {state.preview === 'showImage' && (
              <AttachmentViewer
                attachments={state.attachments}
                href={state.attachmentHref}
                onShowAttachment={payload => dispatch({ type: 'showImage', payload })}
              />
            )}
          </Preview>
        )}

        {state.preview && <CloseButton aria-label="Sluiten" onClick={() => dispatch({ type: 'closeAll' })} />}
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
