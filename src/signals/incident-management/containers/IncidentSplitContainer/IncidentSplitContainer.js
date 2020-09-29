import React, { useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { makeSelectSubCategories } from 'models/categories/selectors';

import useFetch from 'hooks/useFetch';
import configuration from 'shared/services/configuration/configuration';
import { showGlobalNotification } from 'containers/App/actions';
import { VARIANT_SUCCESS, VARIANT_ERROR, TYPE_LOCAL } from 'containers/Notification/constants';
import { INCIDENT_URL } from 'signals/incident-management/routes';

import LoadingIndicator from 'components/LoadingIndicator';
import IncidentSplitForm from './IncidentSplitForm';

const IncidentSplitContainer = ({ FormComponent }) => {
  const { data, error, get, isLoading, isSuccess, post } = useFetch();
  const { id } = useParams();
  const history = useHistory();
  const storeDispatch = useDispatch();

  const subcategories = useSelector(makeSelectSubCategories);

  const subcategoryOptions = useMemo(
    () => subcategories?.map(category => ({ ...category, value: category.extendedName })),
    [subcategories]
  );

  useEffect(() => {
    get(`${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}`);
  }, [get, id]);

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
  }, [error, history, id, isSuccess, storeDispatch]);

  const onSubmit = useCallback(
    /**
     * Data coming from the submitted form
     *
     * @param {Object[]} formData
     * @param {string} formData[].description
     * @param {string} formData[].subcategory
     * @param {string} formData[].priority
     * @param {string} formData[].type
     */
    formData => {
      // console.log('submitted form raw data:', JSON.stringify(formData, null, 2));

      const {
        attachments,
        extra_properties,
        incident_date_end,
        incident_date_start,
        location,
        reporter,
        source,
        text_extra,
      } = data;

      const { stadsdeel, buurt_code, address, geometrie } = location;

      const parentData = {
        attachments,
        extra_properties,
        incident_date_end,
        incident_date_start,
        location: { stadsdeel, buurt_code, address, geometrie },
        reporter,
        source,
        text_extra,
      };

      const mergedData = formData.incidents
        .filter(issue => issue)
        .reduce((acc, { subcategory, description, type, priority }) => {
          const partialData = {
            category: { subcategory },
            priority: { priority },
            text: description,
            type: { code: type },
          };

          return [...acc, { ...parentData, ...partialData, parent: data.id }];
        }, []);

      // console.log('post mergedData:', JSON.stringify(mergedData, null, 2));
      post(configuration.INCIDENTS_ENDPOINT, mergedData);
    },
    [data, post]
  );

  return (
    <div data-testid="incidentSplitContainer">
      {isLoading || !data || !subcategories ? (
        <LoadingIndicator />
      ) : (
        <FormComponent
          data-testid="incidentSplitForm"
          parentIncident={{
            id: data.id,
            status: data.status.state,
            statusDisplayName: data.status.state_display,
            priority: data.priority.priority,
            subcategory: data.category.category_url,
            subcategoryDisplayName: data.category.departments,
            description: data.text,
            type: data.type.code,
          }}
          subcategories={subcategoryOptions}
          onSubmit={onSubmit}
        />
      )}
    </div>
  );
};

IncidentSplitContainer.defaultProps = {
  FormComponent: IncidentSplitForm,
};

IncidentSplitContainer.propTypes = {
  FormComponent: PropTypes.func,
};

export default IncidentSplitContainer;
