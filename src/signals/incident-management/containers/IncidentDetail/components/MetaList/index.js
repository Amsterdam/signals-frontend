import React, { Fragment, useLayoutEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import get from 'lodash.get';
import { useSelector } from 'react-redux';
import { Link as AscLink, Button, themeColor, themeSpacing } from '@datapunt/asc-ui';

import { string2date, string2time } from 'shared/services/string-parser/string-parser';
import { makeSelectSubCategories } from 'models/categories/selectors';
import { typesList, priorityList } from 'signals/incident-management/definitions';

import { incidentType } from 'shared/types';
import RadioInput from 'signals/incident-management/components/RadioInput';

import ChangeValue from './components/ChangeValue';
import Highlight from '../Highlight';
import IconEdit from '../../../../../../shared/images/icon-edit.svg';

const getId = item => item.href.match(/\/(\d+)$/)[1];

const List = styled.dl`
  dt {
    color: ${themeColor('tint', 'level5')};
    margin-bottom: ${themeSpacing(1)};
    position: relative;
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
  const children = get(incident, '_links.sia:children');
  const parent = get(incident, '_links.sia:parent');
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
          <EditButton icon={<IconEdit />} iconSize={18} variant="application" type="button" onClick={onEditStatus} />
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
            display="Subcategorie"
            list={subcategories}
            incident={incident}
            path="category.sub_category"
            valuePath="category.category_url"
            patch={{ status: { state: 'm' } }}
            type="subcategory"
            sort
            disabled={subcatHighlightDisabled}
            onPatchIncident={patchIncident}
          />
        </Highlight>
      )}

      <Highlight subscribeTo={incident.category.main_slug} valueChanged={valueChanged}>
        <dt data-testid="meta-list-main-category-definition">Hoofdcategorie</dt>
        <dd data-testid="meta-list-main-category-value">{incident.category.main}</dd>
      </Highlight>

      {parent && (
        <Fragment>
          <dt data-testid="meta-list-parent-definition">Oorspronkelijke melding</dt>
          <dd>
            <AscLink data-testid="meta-list-parent-link" forwardedAs={Link} to={`/manage/incident/${getId(parent)}`}>
              {getId(parent)}
            </AscLink>
          </dd>
        </Fragment>
      )}

      {children?.length > 0 && (
        <Fragment>
          <dt data-testid="meta-list-children-definition">Gesplitst in</dt>
          <dd>
            {children.map(child => (
              <AscLink
                className="childLink"
                data-testid={`meta-list-children-link-${getId(child)}`}
                key={child.href}
                forwardedAs={Link}
                variant="inline"
                to={`/manage/incident/${getId(child)}`}
              >
                {getId(child)}
              </AscLink>
            ))}
          </dd>
        </Fragment>
      )}

      <Highlight subscribeTo={incident.category.departments} valueChanged={valueChanged}>
        <dt data-testid="meta-list-department-definition">Verantwoordelijke afdeling</dt>
        <dd data-testid="meta-list-department-value">{incident.category.departments}</dd>
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
