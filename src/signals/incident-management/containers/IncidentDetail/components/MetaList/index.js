import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import { string2date, string2time } from 'shared/services/string-parser/string-parser';

import ChangeValue from './components/ChangeValue';
import Highlight from '../../components/Highlight';

import './style.scss';

const MetaList = ({ incident, subcategories, priorityList, onPatchIncident, onEditStatus }) => (
  <div className="meta-list">
    <dl>
      <dt className="meta-list__definition">Gemeld op</dt>
      <dd className="meta-list__value">{string2date(incident.created_at)} {string2time(incident.created_at)}</dd>

      <dt className="meta-list__definition">
        <button className="meta-list__edit detail__button--edit" onClick={onEditStatus} />
        Status
      </dt>
      <dd className="meta-list__value">{incident.status.state_display}</dd>

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
          type="subcategory"
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

      <dt className="meta-list__definition">Verantwoordelijke afdeling</dt>
      <dd className="meta-list__value">{incident.category.department}</dd>

      <dt className="meta-list__definition">Bron</dt>
      <dd className="meta-list__value">{incident.source}</dd>

      {incident.parent_id ?
        (<span>
          <dt className="meta-list__definition">Oorspronkelijke melding</dt>
          <dd className="meta-list__value"><NavLink className="meta-list__link" to={`/manage/incident/${incident.parent_id}`}>{incident.parent_id}</NavLink></dd>
        </span>)
        : ''}
      {incident.child_ids && incident.child_ids.length > 0 ?
        (<span>
          <dt className="meta-list__definition">Gesplitst in</dt>
          <dd className="meta-list__value">{incident.child_ids.map((child_id) =>
            (<NavLink className="meta-list__link" key={child_id} to={`/manage/incident/${child_id}`}>{child_id}</NavLink>))}</dd>
        </span>)
        : ''}

    </dl>
  </div>
);

MetaList.propTypes = {
  incident: PropTypes.object.isRequired,
  priorityList: PropTypes.array.isRequired,
  subcategories: PropTypes.array.isRequired,

  onPatchIncident: PropTypes.func.isRequired,
  onEditStatus: PropTypes.func.isRequired
};

export default MetaList;
