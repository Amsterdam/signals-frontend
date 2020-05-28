import React, { useLayoutEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { Button, themeColor, themeSpacing } from '@datapunt/asc-ui';

import { string2date, string2time } from 'shared/services/string-parser/string-parser';
import { makeSelectSubCategories } from 'models/categories/selectors';
import { typesList, priorityList } from 'signals/incident-management/definitions';

import { incidentType } from 'shared/types';
import RadioInput from 'signals/incident-management/components/RadioInput';

import ChangeValue from './components/ChangeValue';
import Highlight from '../Highlight';
import IconEdit from '../../../../../../shared/images/icon-edit.svg';

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

const MetaList = ({ incident, onEditStatus, onPatchIncident }) => {
  const [valueChanged, setValueChanged] = useState(false);
  const subcategories = useSelector(makeSelectSubCategories);
  const subcatHighlightDisabled = ![
    'm',
    'reopened',
    'i',
    'b',
    'ingepland',
    'send failed',
    'closure requested',
  ].includes(incident.status.state);

  useLayoutEffect(() => {
    setValueChanged(false);
  }, [incident.id]);

  const patchIncident = useCallback(
    patchedData => {
      setValueChanged(true);
      onPatchIncident(patchedData);
    },
    [onPatchIncident]
  );

  return (
    <List>
      <dt data-testid="meta-list-date-definition">Gemeld op</dt>
      <dd data-testid="meta-list-date-value">
        {string2date(incident.created_at)} {string2time(incident.created_at)}
      </dd>

      <Highlight subscribeTo={incident.status.state} valueChanged={valueChanged}>
        <dt data-testid="meta-list-status-definition">
          <EditButton data-testid="editStatusButton" icon={<IconEdit />} iconSize={18} variant="application" type="button" onClick={onEditStatus} />
          Status
        </dt>
        <dd className="alert" data-testid="meta-list-status-value">
          {incident.status.state_display}
        </dd>
      </Highlight>

      {incident.priority && (
        <Highlight subscribeTo={incident.priority.priority} valueChanged={valueChanged}>
          <ChangeValue
            display="Urgentie"
            valueClass={incident.priority.priority === 'high' ? 'alert' : ''}
            list={priorityList}
            incident={incident}
            path="priority.priority"
            type="priority"
            onPatchIncident={patchIncident}
            component={RadioInput}
          />
        </Highlight>
      )}

      {incident.type && (
        <Highlight subscribeTo={incident.type.code} valueChanged={valueChanged}>
          <ChangeValue
            component={RadioInput}
            display="Type"
            incident={incident}
            list={typesList}
            onPatchIncident={patchIncident}
            path="type.code"
            type="type"
          />
        </Highlight>
      )}

      {subcategories && (
        <Highlight subscribeTo={incident.category.sub_slug} valueChanged={valueChanged}>
          <ChangeValue
            disabled={subcatHighlightDisabled}
            display="Subcategorie"
            incident={incident}
            infoKey="description"
            list={subcategories}
            onPatchIncident={patchIncident}
            patch={{ status: { state: 'm' } }}
            path="category.sub_category"
            sort
            type="subcategory"
            valuePath="category.category_url"
          />
        </Highlight>
      )}

      <Highlight subscribeTo={incident.category.main_slug} valueChanged={valueChanged}>
        <dt data-testid="meta-list-main-category-definition">Hoofdcategorie</dt>
        <dd data-testid="meta-list-main-category-value">{incident.category.main}</dd>
      </Highlight>

      <dt data-testid="meta-list-source-definition">Bron</dt>
      <dd data-testid="meta-list-source-value">{incident.source}</dd>
    </List>
  );
};

MetaList.propTypes = {
  incident: incidentType.isRequired,
  onEditStatus: PropTypes.func.isRequired,
  onPatchIncident: PropTypes.func.isRequired,
};

export default MetaList;
