import React, { useEffect, useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { makeSelectSubCategories } from 'models/categories/selectors';
import { makeSelectDepartments, makeSelectDirectingDepartments } from 'models/departments/selectors';

import useFetch from 'hooks/useFetch';
import configuration from 'shared/services/configuration/configuration';
import { showGlobalNotification } from 'containers/App/actions';
import { VARIANT_SUCCESS, VARIANT_ERROR, TYPE_LOCAL } from 'containers/Notification/constants';
import { INCIDENT_URL } from 'signals/incident-management/routes';

import LoadingIndicator from 'components/LoadingIndicator';
import IncidentSplitForm from './components/IncidentSplitForm';

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
  const directingDepartments = useSelector(makeSelectDirectingDepartments);
  const directingDepartmentList = useMemo(
    () => [
      { key: 'null', value: 'Verantwoordelijke afdeling' },
      ...directingDepartments.map(({ code }) => ({ key: code, value: code })),
    ],
    [directingDepartments]
  );

  const subcategories = useSelector(makeSelectSubCategories);
  const subcategoryOptions = useMemo(
    () => subcategories?.map(category => ({ ...category, value: category.extendedName })),
    [subcategories]
  );

  const parentDirectingDepartment = useMemo(() => {
    const department = parentIncident?.directing_departments;
    if (!Array.isArray(department) || department.length !== 1) return 'null';
    const { code } = department[0];
    return directingDepartmentList.find(({ key }) => key === code) ? code : 'null';
  }, [parentIncident, directingDepartmentList]);

  const updateDepartment = useCallback(
    name => {
      const department = departments?.list.find(d => d.code === name);
      setDirectingDepartment(department ? [{ id: department.id }] : []);
    },
    [departments, setDirectingDepartment]
  );

  useEffect(() => {
    getParent(`${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}`);
  }, [getParent, id]);

  useEffect(() => {
    if (errorParent === undefined && dataParent === undefined) return;

    /* istanbul ignore else */
    if (errorParent === false) {
      setParentIncident(dataParent);
    }
  }, [errorParent, dataParent]);

  useEffect(() => {
    if (isSuccessSplit === undefined || errorSplit === undefined) return;
    if (isSuccessSplit) {
      patch(`${configuration.INCIDENT_PRIVATE_ENDPOINT}${id}`, { directing_departments: directingDepartment });
    } else {
      dispatch(
        showGlobalNotification({
          title: 'De melding kon niet gedeeld worden',
          variant: VARIANT_ERROR,
          type: TYPE_LOCAL,
        })
      );

      history.push(`${INCIDENT_URL}/${id}`);
    }

    // Disabling linter; the `history` dependency is generating infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorSplit, isSuccessSplit, id, dispatch, patch, directingDepartment]);

  useEffect(() => {
    if (isSuccessUpdate === undefined || errorUpdate === undefined) return;

    // The scenario when there is an error during the patch of the parent incident
    // is intentionally left out.

    dispatch(
      showGlobalNotification({
        title: 'De melding is succesvol gedeeld',
        variant: VARIANT_SUCCESS,
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
        .filter(Boolean)
        .map(({ subcategory, description, type, priority }) => {
          const partialData = {
            category: { category_url: subcategory },
            priority: { priority },
            text: description,
            type: { code: type },
          };

          return { ...parentData, ...partialData, parent };
        });

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
          parentIncident={{
            id: parentIncident.id,
            childrenCount: parentIncident?._links?.['sia:children']?.length || 0,
            status: parentIncident.status.state,
            statusDisplayName: parentIncident.status.state_display,
            priority: parentIncident.priority.priority,
            subcategory: parentIncident.category.category_url,
            subcategoryDisplayName: `${parentIncident.category.sub} (${parentIncident.category.departments})`,
            description: parentIncident.text,
            type: parentIncident.type.code,
            directingDepartment: parentDirectingDepartment,
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
