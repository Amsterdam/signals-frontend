import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import { string2date, string2time } from 'shared/services/string-parser/string-parser';
import { getListValueByKey } from 'shared/services/list-helper/list-helper';


import './style.scss';

const MetaList = ({ incident, priorityList }) => (
  <div className="meta-list">
    <dl>
      <dt className="meta-list__definition">Gemeld op</dt>
      <dd className="meta-list__value">{string2date(incident.created_at)} {string2time(incident.created_at)}</dd>

      <dt className="meta-list__definition">Status</dt>
      <dd className="meta-list__value">{incident.status.state_display}&nbsp;</dd>

      <dt className="meta-list__definition">Urgentie</dt>
      <dd className="meta-list__value">{getListValueByKey(priorityList, incident.priority && incident.priority.priority)}&nbsp;</dd>

      <dt className="meta-list__definition">Subcategorie</dt>
      <dd className="meta-list__value">{incident.category.sub}&nbsp;</dd>

      <dt className="meta-list__definition">Hoofdcategorie</dt>
      <dd className="meta-list__value">{incident.category.main}&nbsp;</dd>

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
  priorityList: PropTypes.array.isRequired
};

export default MetaList;
// {getListValueByKey(stadsdeelList, incident.location.stadsdeel)}&nbsp
