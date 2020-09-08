import React, { useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import useFetch from 'hooks/useFetch';
import configuration from 'shared/services/configuration/configuration';
import { showGlobalNotification } from 'containers/App/actions';
import { VARIANT_SUCCESS, VARIANT_ERROR, TYPE_LOCAL } from 'containers/Notification/constants';
import { INCIDENT_URL } from 'signals/incident-management/routes';

import LoadingIndicator from 'components/LoadingIndicator';
import Form from './Form';

const IncidentSplitContainer = ({ FormComponent }) => {
  const [incidentData, setIncidentData] = useState();
  const { data, error, get, isLoading, isSuccess, post } = useFetch();
  const { id } = useParams();
  const history = useHistory();
  const storeDispatch = useDispatch();

  useEffect(() => {
    get(`${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}`);
  }, [get, id]);

  useEffect(() => {
    if (!data) return;

    setIncidentData(data);
  }, [data]);

  useEffect(() => {
    if (isSuccess === undefined || error === undefined) return;

    const notificationProps = isSuccess
      ? {
        title: 'De melding is succesvol gesplitst',
        variant: VARIANT_SUCCESS,
      }
      : {
        title: 'De melding kon niet gesplitst worden',
        variant: VARIANT_ERROR,
      };

    storeDispatch(
      showGlobalNotification({
        ...notificationProps,
        type: TYPE_LOCAL,
      })
    );

    history.push(`${INCIDENT_URL}/${id}`);
  }, [error, isSuccess, storeDispatch, history, id]);

  const onSubmit = useCallback(
    /**
     * Data coming from the submitted form
     *
     * @param {Object[]} formData
     * @param {string} formData[].text
     * @param {string} formData[].category
     * @param {string} formData[].priority
     * @param {string} formData[].type
     */
    formData => {
      const {
        extra_properties,
        incident_date_end,
        incident_date_start,
        location,
        reporter,
        source,
        text_extra,
      } = incidentData;

      const parentData = {
        extra_properties,
        incident_date_end,
        incident_date_start,
        location,
        reporter,
        source,
        text_extra,
      };

      const mergedData = formData.reduce(
        (acc, partialIncidentData) => [...acc, { ...parentData, ...partialIncidentData, parent: incidentData.id }],
        []
      );

      post(configuration.INCIDENTS_ENDPOINT, mergedData);
    },
    [post, incidentData]
  );

  return (
    <div data-testid="incidentSplitContainer">
      {isLoading ? <LoadingIndicator /> : <FormComponent data-testid="incidentSplitForm" onSubmit={onSubmit} />}
    </div>
  );
};

IncidentSplitContainer.defaultProps = {
  FormComponent: Form,
};

IncidentSplitContainer.propTypes = {
  FormComponent: PropTypes.func,
};

export default IncidentSplitContainer;
