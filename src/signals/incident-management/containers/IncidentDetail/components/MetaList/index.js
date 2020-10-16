import React, { useCallback, useContext, useMemo } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { Button, themeColor, themeSpacing } from '@datapunt/asc-ui';

import { string2date, string2time } from 'shared/services/string-parser';
import { makeSelectSubCategories } from 'models/categories/selectors';
import { typesList, priorityList, directingDepartmentList } from 'signals/incident-management/definitions';

import RadioInput from 'signals/incident-management/components/RadioInput';
import SelectInput from 'signals/incident-management/components/SelectInput';

import { makeSelectDepartments } from 'models/departments/selectors';
import ChangeValue from './components/ChangeValue';
import Highlight from '../Highlight';
import IconEdit from '../../../../../../shared/images/icon-edit.svg';
import IncidentDetailContext from '../../context';

const List = styled.dl`
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

const getDirectingDepartmentValue = value => (value?.length === 1 && value[0].code === 'ASC' ? 'ASC' : 'null');

const MetaList = () => {
  const { incident, edit } = useContext(IncidentDetailContext);
  const subcategories = useSelector(makeSelectSubCategories);
  const departments = useSelector(makeSelectDepartments);
  const subcategoryOptions = useMemo(
    () =>
      subcategories?.map(category => ({
        ...category,
        value: category.extendedName,
      })),
    // disabling linter; we want to allow possible null subcategories
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [subcategories]
  );
  const hasChildren = useMemo(() => incident?._links['sia:children']?.length > 0, [incident]);

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
    <List>
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
            options={directingDepartmentList}
            path="directing_departments"
            type="directing_departments"
            getValue={getDirectingDepartmentValue}
            getSelectedOption={getDirectingDepartmentPostData}
          />
        </Highlight>
      )}

      <Highlight type="subcategory">
        <dt data-testid="meta-list-main-category-definition">Hoofdcategorie</dt>
        <dd data-testid="meta-list-main-category-value">{incident.category.main}</dd>
      </Highlight>

      <dt data-testid="meta-list-source-definition">Bron</dt>
      <dd data-testid="meta-list-source-value">{incident.source}</dd>
    </List>
  );
};

export default MetaList;
