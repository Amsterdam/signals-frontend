import React, { useLayoutEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import get from 'lodash.get';
import { useSelector } from 'react-redux';

import {
  string2date,
  string2time,
} from 'shared/services/string-parser/string-parser';
import { makeSelectSubCategories } from 'models/categories/selectors';

import { incidentType } from 'shared/types';
import RadioInput from 'signals/incident-management/components/RadioInput';
import { priorityList, typesList } from 'signals/incident-management/definitions';

import ChangeValue from './components/ChangeValue';
import Highlight from '../Highlight';

import './style.scss';

function getId(item) {
  return item.href.match(/\/(\d+)$/)[1];
}

const MetaList = ({
  incident,
  onEditStatus,
  onPatchIncident,
}) => {
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

  const patchIncident = useCallback(patchedData => {
    setValueChanged(true);
    onPatchIncident(patchedData);
  }, [onPatchIncident]);

  return (
    <div className="meta-list">
      <dl>
        <dt className="meta-list__definition" data-testid="meta-list-date-definition">
          Gemeld op
        </dt>
        <dd className="meta-list__value" data-testid="meta-list-date-value">
          {string2date(incident.created_at)} {string2time(incident.created_at)}
        </dd>

        <Highlight subscribeTo={incident.status.state} valueChanged={valueChanged}>
          <dl>
            <dt className="meta-list__definition" data-testid="meta-list-status-definition">
              <button className="meta-list__edit incident-detail__button--edit" type="button" onClick={onEditStatus} />
              Status
            </dt>
            <dd className="meta-list__value meta-list__value--status" data-testid="meta-list-status-value">
              {incident.status.state_display}
            </dd>
          </dl>
        </Highlight>

        {incident.priority && (
          <Highlight subscribeTo={incident.priority.priority} valueChanged={valueChanged}>
            <ChangeValue
              display="Urgentie"
              definitionClass="meta-list__definition"
              valueClass={`meta-list__value ${incident.priority.priority === 'high' ? 'meta-list__value--status' : ''}`}
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
              definitionClass="meta-list__definition"
              display="Type"
              incident={incident}
              list={typesList}
              onPatchIncident={patchIncident}
              path="type.code"
              type="type"
              valueClass="meta-list__value"
            />
          </Highlight>
        )}

        {subcategories && (
          <Highlight subscribeTo={incident.category.sub_slug} valueChanged={valueChanged}>
            <ChangeValue
              display="Subcategorie"
              definitionClass="meta-list__definition"
              valueClass="meta-list__value"
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
          <dl>
            <dt className="meta-list__definition" data-testid="meta-list-main-category-definition">
              Hoofdcategorie
            </dt>
            <dd className="meta-list__value" data-testid="meta-list-main-category-value">
              {incident.category.main}
            </dd>
          </dl>
        </Highlight>

        {parent && (
          <span>
            <dt className="meta-list__definition" data-testid="meta-list-parent-definition">
              Oorspronkelijke melding
            </dt>
            <dd className="meta-list__value">
              <NavLink
                className="meta-list__link"
                data-testid="meta-list-parent-link"
                to={`/manage/incident/${getId(parent)}`}
              >
                {getId(parent)}
              </NavLink>
            </dd>
          </span>
        )}

        {children?.length > 0 ? (
          <span>
            <dt className="meta-list__definition" data-testid="meta-list-children-definition">
              Gesplitst in
            </dt>
            <dd className="meta-list__value">
              {children.map(child => (
                <NavLink
                  className="meta-list__link"
                  data-testid={`meta-list-children-link-${getId(child)}`}
                  key={child.href}
                  to={`/manage/incident/${getId(child)}`}
                >
                  {getId(child)}
                </NavLink>
              ))}
            </dd>
          </span>
        ) : (
          ''
        )}

        <Highlight subscribeTo={incident.category.departments} valueChanged={valueChanged}>
          <dl>
            <dt className="meta-list__definition" data-testid="meta-list-department-definition">
              Verantwoordelijke afdeling
            </dt>
            <dd className="meta-list__value" data-testid="meta-list-department-value">
              {incident.category.departments}
            </dd>
          </dl>
        </Highlight>

        <dt className="meta-list__definition" data-testid="meta-list-source-definition">
          Bron
        </dt>
        <dd className="meta-list__value" data-testid="meta-list-source-value">
          {incident.source}
        </dd>
      </dl>
    </div>
  );
};

MetaList.propTypes = {
  incident: incidentType.isRequired,
  onEditStatus: PropTypes.func.isRequired,
  onPatchIncident: PropTypes.func.isRequired,
};

export default MetaList;
