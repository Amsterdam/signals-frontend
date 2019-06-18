import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import get from 'lodash.get';

import { string2date, string2time } from 'shared/services/string-parser/string-parser';

import ChangeValue from './components/ChangeValue';
import Highlight from '../../components/Highlight';

import './style.scss';

function getId(item) {
  return item.href.match(/\/(\d+)$/)[1];
}


const MetaList = ({ incident, subcategories, priorityList, onPatchIncident, onEditStatus }) => {
  const children = get(incident, '_links.sia:children');
  const parent = get(incident, '_links.sia:parent');

  return (
    <div className="meta-list">
      <dl>
        <dt className="meta-list__definition">Gemeld op</dt>
        <dd className="meta-list__value">{string2date(incident.created_at)} {string2time(incident.created_at)}</dd>

        <Highlight
          subscribeTo={incident.status.state}
        >
          <dl>
            <dt className="meta-list__definition">
              <button className="meta-list__edit incident-detail__button--edit" onClick={onEditStatus} />
              Status
            </dt>
            <dd className="meta-list__value">{incident.status.state_display}</dd>
          </dl>
        </Highlight>

        <Highlight
          subscribeTo={incident.priority.priority}
        >
          <ChangeValue
            display="Urgentie"
            definitionClass="meta-list__definition"
            valueClass="meta-list__value"
            list={priorityList}
            incident={incident}
            path="priority.priority"
            type="priority"
            onPatchIncident={onPatchIncident}
          />
        </Highlight>

        <Highlight
          subscribeTo={incident.category.sub_slug}
        >
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
            disabled={!['m', 'i', 'b', 'ingepland', 'send failed', 'closure requested'].includes(incident.status.state)}
            onPatchIncident={onPatchIncident}
          />
        </Highlight>

        <Highlight
          subscribeTo={incident.category.main_slug}
        >
          <dl>
            <dt className="meta-list__definition">Hoofdcategorie</dt>
            <dd className="meta-list__value">{incident.category.main}</dd>
          </dl>
        </Highlight>

        {parent ?
          (<span>
            <dt className="meta-list__definition">Oorspronkelijke melding</dt>
            <dd className="meta-list__value"><NavLink className="meta-list__link" to={`/manage/incident/${getId(parent)}`}>{getId(parent)}</NavLink></dd>
          </span>)
          : ''}

        {children && children.length > 0 ?
          (<span>
            <dt className="meta-list__definition">Gesplitst in</dt>
            <dd className="meta-list__value">{children.map((child) =>
              (<NavLink className="meta-list__link" key={child.href} to={`/manage/incident/${getId(child)}`}>{getId(child)}</NavLink>))}</dd>
          </span>)
          : ''}

        <dt className="meta-list__definition">Verantwoordelijke afdeling</dt>
        <dd className="meta-list__value">{incident.category.departments}</dd>

        <dt className="meta-list__definition">Bron</dt>
        <dd className="meta-list__value">{incident.source}</dd>

      </dl>
    </div>
  );
};

MetaList.propTypes = {
  incident: PropTypes.object.isRequired,
  priorityList: PropTypes.array.isRequired,
  subcategories: PropTypes.array.isRequired,

  onPatchIncident: PropTypes.func.isRequired,
  onEditStatus: PropTypes.func.isRequired
};

export default MetaList;
