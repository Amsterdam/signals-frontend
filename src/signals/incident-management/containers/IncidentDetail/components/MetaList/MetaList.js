import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { string2date, string2time } from 'shared/services/string-parser';
import { makeSelectSubCategories } from 'models/categories/selectors';
import { typesList, priorityList } from 'signals/incident-management/definitions';

import RadioInput from 'signals/incident-management/components/RadioInput';
import SelectInput from 'signals/incident-management/components/SelectInput';

import * as S from './MetaList.styles';
import ChangeValue from '../ChangeValue';
import Highlight from '../Highlight';
import IconEdit from '../../../../../../shared/images/icon-edit.svg';
import IncidentDetailContext from '../../context';
import IncidentManagementContext from '../../../../context';

const MetaList = () => {
  const { incident, update, edit } = useContext(IncidentDetailContext);
  const { users } = useContext(IncidentManagementContext);
  const [usersList, setUsersList] = useState([]);
  const subcategories = useSelector(makeSelectSubCategories);
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

  useEffect(() => {
    setUsersList(
      users
        ? [
          {
            key: null,
            value: 'Niet toegewezen',
          },
          ...users.map(user => ({
            key: user.id,
            value: user.username,
          })),
        ]
        : []
    );
  }, [users]);

  const subcatHighlightDisabled = ![
    'm',
    'reopened',
    'i',
    'b',
    'ingepland',
    'send failed',
    'closure requested',
  ].includes(incident.status.state);

  return (
    <S.MetaList>
      <dt data-testid="meta-list-date-definition">Gemeld op</dt>
      <dd data-testid="meta-list-date-value">
        {string2date(incident.created_at)} {string2time(incident.created_at)}
      </dd>

      <Highlight type="status">
        <dt data-testid="meta-list-status-definition">
          <S.EditButton
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
            list={priorityList}
            path="priority.priority"
            type="priority"
            onPatchIncident={update}
            component={RadioInput}
          />
        </Highlight>
      )}

      {incident.type && (
        <Highlight type="type">
          <ChangeValue
            component={RadioInput}
            display="Type"
            list={typesList}
            onPatchIncident={update}
            path="type.code"
            type="type"
          />
        </Highlight>
      )}

      {(incident.assigned_user_id || usersList.length) && (
        <Highlight type="assigned_user_id">
          <ChangeValue
            component={SelectInput}
            display="Toegewezen aan"
            list={usersList}
            onPatchIncident={update}
            path="assigned_user_id"
            type="assigned_user_id"
          />
        </Highlight>
      )}

      {subcategoryOptions && (
        <Highlight type="subcategory">
          <ChangeValue
            disabled={subcatHighlightDisabled}
            display="Subcategorie (verantwoordelijke afdeling)"
            list={subcategoryOptions}
            infoKey="description"
            onPatchIncident={update}
            patch={{ status: { state: 'm' } }}
            path="category.sub_category"
            sort
            type="subcategory"
            valuePath="category.category_url"
          />
        </Highlight>
      )}

      <Highlight type="subcategory">
        <dt data-testid="meta-list-main-category-definition">Hoofdcategorie</dt>
        <dd data-testid="meta-list-main-category-value">{incident.category.main}</dd>
      </Highlight>

      <dt data-testid="meta-list-source-definition">Bron</dt>
      <dd data-testid="meta-list-source-value">{incident.source}</dd>
    </S.MetaList>
  );
};

export default MetaList;
