import React, { useCallback, useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Button, themeColor, themeSpacing } from '@datapunt/asc-ui';

import { makeSelectSubCategories } from 'models/categories/selectors';
import { makeSelectDepartments, makeSelectDirectingDepartments } from 'models/departments/selectors';
import configuration from 'shared/services/configuration/configuration';
import { string2date, string2time } from 'shared/services/string-parser';
import RadioInput from 'signals/incident-management/components/RadioInput';
import SelectInput from 'signals/incident-management/components/SelectInput';
import { typesList, priorityList } from 'signals/incident-management/definitions';

import ChangeValue from '../ChangeValue';
import Highlight from '../Highlight';
import IconEdit from '../../../../../../shared/images/icon-edit.svg';
import IncidentDetailContext from '../../context';
import IncidentManagementContext from '../../../../context';

const StyledMetaList = styled.dl`
  dt {
    color: ${themeColor('tint', 'level5')};
    margin-bottom: ${themeSpacing(1)};
    position: relative;
    font-weight: 400;
  }

  dd {
    margin-bottom: ${themeSpacing(4)};

    &.alert {
      color: ${themeColor('secondary')};
      font-family: Avenir Next LT W01 Demi, arial, sans-serif;
    }

    .childLink:not(:first-child) {
      margin-left: ${themeSpacing(2)};
    }
  }
`;

const EditButton = styled(Button)`
  position: absolute;
  top: 0;
  right: 0;
  padding: ${themeSpacing(0, 1.5)};
`;

const MetaList = () => {
  const { incident, update, edit } = useContext(IncidentDetailContext);
  const { users } = useContext(IncidentManagementContext);
  const departments = useSelector(makeSelectDepartments);
  const directingDepartments = useSelector(makeSelectDirectingDepartments);

  const routingDepartments = useMemo(
    () =>
      (configuration.featureFlags.assignSignalToEmployee || configuration.featureFlags.assignSignalToDepartment) &&
      incident.routing_departments?.length &&
      incident.routing_departments,
    [incident]
  );

  const categoryDepartments = useMemo(
    () =>
      departments?.list &&
      (incident.category?.departments || '')
        .split(',')
        .map(code => code.trim())
        .map(code => departments.list.find(department => department.code === code))
        .filter(Boolean),
    [departments, incident]
  );

  const incidentDepartmentNames = useMemo(() => {
    if (!configuration.featureFlags.assignSignalToEmployee) return [];

    const routingDepartmentNames = routingDepartments?.length && routingDepartments.map(department => department.name);

    const categoryDepartmentNames = !routingDepartmentNames && categoryDepartments?.map(department => department.name);

    return routingDepartmentNames || categoryDepartmentNames || [];
  }, [routingDepartments, categoryDepartments]);

  const subcategories = useSelector(makeSelectSubCategories);

  const subcategoryOptions = useMemo(
    () =>
      subcategories?.map(category => ({
        ...category,
        value: category.extendedName,
      })),
    [subcategories]
  );
  const hasChildren = useMemo(() => incident._links['sia:children']?.length > 0, [incident]);

  const getDirectingDepartmentCode = useCallback(
    value => {
      if (!Array.isArray(value) || value.length !== 1) return 'null';
      const { code } = value[0];
      return directingDepartments.some(({ key }) => key === code) ? code : 'null';
    },
    [directingDepartments]
  );

  const userOptions = useMemo(
    () =>
      configuration.featureFlags.assignSignalToEmployee &&
      users && [
        {
          key: null,
          value: 'Niet toegewezen',
        },
        ...users
          .filter(
            user =>
              user.id === incident.assigned_user_id ||
              incidentDepartmentNames.some(name => user.profile?.departments?.includes(name))
          )
          .map(user => ({
            key: user.id,
            value: user.username,
          })),
      ],
    [incident, incidentDepartmentNames, users]
  );

  const departmentOptions = useMemo(() => {
    if (!configuration.featureFlags.assignSignalToDepartment) return [];

    const options =
      categoryDepartments?.length > 1 &&
      categoryDepartments.map(department => ({
        key: `${department.id}`,
        value: department.name,
      }));

    return routingDepartments
      ? options
      : options && [
        {
          key: null,
          value: 'Niet gekoppeld',
        },
        ...options,
      ];
  }, [categoryDepartments, routingDepartments]);

  const getDepartmentId = useCallback(
    () => (routingDepartments ? `${routingDepartments[0].id}` : departmentOptions && departmentOptions[0].key),
    [departmentOptions, routingDepartments]
  );

  const getDepartmentPostData = useCallback(
    id =>
      id
        ? [
          {
            id: Number.parseInt(id, 10),
          },
        ]
        : [],
    []
  );

  const subcatHighlightDisabled = ![
    'm',
    'reopened',
    'i',
    'b',
    'ingepland',
    'send failed',
    'closure requested',
  ].includes(incident.status.state);

  // This conversion is needed to meet the api structure
  const getDirectingDepartmentPostData = useCallback(
    code => {
      const department = departments?.list.find(d => d.code === code);
      return department ? [{ id: department.id }] : [];
    },
    [departments]
  );

  return (
    <StyledMetaList>
      <dt data-testid="meta-list-date-definition">Gemeld op</dt>
      <dd data-testid="meta-list-date-value">
        {string2date(incident.created_at)} {string2time(incident.created_at)}
      </dd>

      <Highlight type="status">
        <dt data-testid="meta-list-status-definition">
          <EditButton
            data-testid="editStatusButton"
            icon={<IconEdit />}
            iconSize={18}
            variant="application"
            type="button"
            onClick={() => edit('status')}
          />
          Status
        </dt>
        <dd className="alert" data-testid="meta-list-status-value">
          {incident.status.state_display}
        </dd>
      </Highlight>

      {incident.priority && (
        <Highlight type="priority">
          <ChangeValue
            display="Urgentie"
            valueClass={incident.priority.priority === 'high' ? 'alert' : ''}
            options={priorityList}
            path="priority.priority"
            type="priority"
            component={RadioInput}
          />
        </Highlight>
      )}

      {incident.type && (
        <Highlight type="type">
          <ChangeValue component={RadioInput} display="Type" options={typesList} path="type.code" type="type" />
        </Highlight>
      )}

      {configuration.featureFlags.assignSignalToEmployee && userOptions && (
        <Highlight type="assigned_user_id">
          <ChangeValue
            component={SelectInput}
            display="Toegewezen aan"
            options={userOptions}
            onPatchIncident={update}
            path="assigned_user_id"
            type="assigned_user_id"
          />
        </Highlight>
      )}

      {configuration.featureFlags.assignSignalToDepartment && departmentOptions && (
        <Highlight type="routing_departments">
          <ChangeValue
            component={SelectInput}
            display="Afdeling"
            options={departmentOptions}
            onPatchIncident={update}
            path="routing_departments"
            type="routing_departments"
            rawDataToKey={getDepartmentId}
            keyToRawData={getDepartmentPostData}
          />
        </Highlight>
      )}

      {subcategoryOptions && (
        <Highlight type="subcategory">
          <ChangeValue
            component={SelectInput}
            disabled={subcatHighlightDisabled}
            display="Subcategorie (verantwoordelijke afdeling)"
            options={subcategoryOptions}
            infoKey="description"
            patch={{ status: { state: 'm' } }}
            path="category.sub_category"
            sort
            type="subcategory"
            valuePath="category.category_url"
          />
        </Highlight>
      )}

      {hasChildren && (
        <Highlight type="directing_departments">
          <ChangeValue
            component={RadioInput}
            display="Regie"
            options={directingDepartments}
            path="directing_departments"
            type="directing_departments"
            rawDataToKey={getDirectingDepartmentCode}
            keyToRawData={getDirectingDepartmentPostData}
          />
        </Highlight>
      )}

      <Highlight type="subcategory">
        <dt data-testid="meta-list-main-category-definition">Hoofdcategorie</dt>
        <dd data-testid="meta-list-main-category-value">{incident.category?.main}</dd>
      </Highlight>

      <dt data-testid="meta-list-source-definition">Bron</dt>
      <dd data-testid="meta-list-source-value">{incident.source}</dd>
    </StyledMetaList>
  );
};

export default MetaList;
