import React, { useEffect, useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDepartments as fetchDepartmentsAction } from 'models/departments/actions';

import { makeSelectSubCategories } from 'models/categories/selectors';
import { makeSelectDepartments } from 'models/departments/selectors';

import useFetch from 'hooks/useFetch';
import configuration from 'shared/services/configuration/configuration';
import { showGlobalNotification } from 'containers/App/actions';
import { VARIANT_SUCCESS, VARIANT_ERROR, TYPE_LOCAL } from 'containers/Notification/constants';
import { INCIDENT_URL } from 'signals/incident-management/routes';

import LoadingIndicator from 'components/LoadingIndicator';
import IncidentSplitForm from './components/IncidentSplitForm';

const getParentIncident = incident => ({
  id: incident.id,
  status: incident.status.state,
  statusDisplayName: incident.status.state_display,
  priority: incident.priority.priority,
  subcategory: incident.category.category_url,
  subcategoryDisplayName: incident.category.departments,
  description: incident.text,
  type: incident.type.code,
});

const IncidentSplitContainer = ({ FormComponent }) => {
  const { error: errorSplit, isSuccess: isSuccessSplit, post } = useFetch();
  const {
    data: dataParent,
    error: errorParent,
    get: getParent,
    isLoading: isLoadingParent,
    isSuccess: isSuccessParent,
  } = useFetch();
  const { error: errorUpdate, patch, isSuccess: isSuccessUpdate } = useFetch();
  const { id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const [parentIncident, setParentIncident] = useState();
  const [directingDepartment, setDirectingDepartment] = useState([]);
  const departments = useSelector(makeSelectDepartments);
  const subcategories = useSelector(makeSelectSubCategories);

  const subcategoryOptions = useMemo(
    () => subcategories?.map(category => ({ ...category, value: category.extendedName })),
    [subcategories]
  );

  const updateDepartment = useCallback(
    name => {
      if (!name || !departments) return;

      const department = departments.list.find(d => d.code === name);
      setDirectingDepartment(department ? [{ id: department.id }] : []);
    },
    [departments, setDirectingDepartment]
  );

  useEffect(() => {
    dispatch(fetchDepartmentsAction());
  }, [dispatch]);

  useEffect(() => {
    getParent(`${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}`);
  }, [getParent, id]);

  useEffect(() => {
    if (isLoadingParent || isSuccessParent || errorParent === undefined) return;

    if (errorParent === false) {
      setParentIncident(dataParent);
    }
  }, [errorParent, isLoadingParent, isSuccessParent, dataParent]);

  useEffect(() => {
    if (isSuccessSplit === undefined || errorSplit === undefined) return;
    if (isSuccessSplit) {
      patch(`${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}`, { directing_department: directingDepartment });
    } else {
      dispatch(
        showGlobalNotification({
          title: 'De melding kon niet gesplitst worden',
          variant: VARIANT_ERROR,
          type: TYPE_LOCAL,
        })
      );
      history.push(`${INCIDENT_URL}/${id}`);
    }

    // Disabling linter; patch and history dependencies are generating infinite loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorSplit, isSuccessSplit, id, dispatch]);

  useEffect(() => {
    if (isSuccessUpdate === undefined || errorUpdate === undefined) return;
    const notificationProps = isSuccessUpdate
      ? {
        title: 'De melding is succesvol gesplitst',
        variant: VARIANT_SUCCESS,
      }
      : {
        title: 'De melding is gesplits maar het bijwerken van de hoofdmelding regie is niet gelukt',
        variant: VARIANT_ERROR,
      };

    dispatch(
      showGlobalNotification({
        ...notificationProps,
        type: TYPE_LOCAL,
      })
    );

    history.push(`${INCIDENT_URL}/${id}`);
  }, [errorUpdate, history, id, isSuccessUpdate, dispatch]);

  const onSubmit = useCallback(
    /**
     * Data coming from the submitted form
     *
     * @param {Object} formData
     * @param {string} formData.department
     * @param {string} formData.incidents[].description
     * @param {string} formData.incidents[].subcategory
     * @param {string} formData.incidents[].priority
     * @param {string} formData.incidents[].type
     */
    ({ department, incidents }) => {
      const {
        id: parent,
        attachments,
        extra_properties,
        incident_date_end,
        incident_date_start,
        location,
        reporter,
        source,
        text_extra,
      } = parentIncident;

      updateDepartment(department);
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

      const mergedData = incidents
        .filter(issue => issue)
        .reduce((acc, { subcategory, description, type, priority }) => {
          const partialData = {
            category: { category_url: subcategory },
            priority: { priority },
            text: description,
            type: { code: type },
          };

          return [...acc, { ...parentData, ...partialData, parent }];
        }, []);

      post(configuration.INCIDENTS_ENDPOINT, mergedData);
    },
    [parentIncident, post, updateDepartment]
  );

  return (
    <div data-testid="incidentSplitContainer">
      {isLoadingParent || isSuccessParent || !parentIncident || !subcategories ? (
        <LoadingIndicator />
      ) : (
        <FormComponent
          data-testid="incidentSplitForm"
          parentIncident={getParentIncident(parentIncident)}
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
