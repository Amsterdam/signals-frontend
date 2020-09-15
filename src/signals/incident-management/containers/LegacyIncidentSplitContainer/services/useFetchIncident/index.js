import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { TYPE_LOCAL, VARIANT_ERROR } from 'containers/Notification/constants';
import { showGlobalNotification } from 'containers/App/actions';

import CONFIGURATION from 'shared/services/configuration/configuration';
import useFetch from 'hooks/useFetch';

const useFetchIncident = id => {
  const { isLoading, error, data: incident, get: getIncident } = useFetch();
  const { get: getIncidentAttachments, data: attachments } = useFetch();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!error) return;
    dispatch(
      showGlobalNotification({
        title: 'Splitsen',
        message: 'De melding gegevens konden niet opgehaald worden',
        variant: VARIANT_ERROR,
        type: TYPE_LOCAL,
      })
    );
  }, [error, dispatch]);

  useEffect(() => {
    if (!id) return;

    getIncident(`${CONFIGURATION.INCIDENTS_ENDPOINT}${id}`);
    getIncidentAttachments(`${CONFIGURATION.INCIDENTS_ENDPOINT}${id}/attachments`);
  }, [id, getIncident, getIncidentAttachments]);

  return { isLoading, incident, attachments: attachments?.results?.slice(0, 3) };
};

export default useFetchIncident;
