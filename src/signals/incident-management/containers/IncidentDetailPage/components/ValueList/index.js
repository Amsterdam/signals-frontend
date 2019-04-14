import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import { string2date, string2time } from 'shared/services/string-parser/string-parser';
import { getListValueByKey } from 'shared/services/list-helper/list-helper';


import './style.scss';

const ValueList = ({ incident, priorityList }) => (
  <div className="value-list">
    <dl>
      <dt className="value-list__definition">Gemeld op</dt>
      <dd className="value-list__value">{string2date(incident.created_at)} {string2time(incident.created_at)}</dd>

      <dt className="value-list__definition">Status</dt>
      <dd className="value-list__value">{incident.status.state_display}&nbsp;</dd>

      <dt className="value-list__definition">Urgentie</dt>
      <dd className="value-list__value">{getListValueByKey(priorityList, incident.priority && incident.priority.priority)}&nbsp;</dd>

      <dt className="value-list__definition">Subcategorie</dt>
      <dd className="value-list__value">{incident.category.sub}&nbsp;</dd>

      <dt className="value-list__definition">Hoofdcategorie</dt>
      <dd className="value-list__value">{incident.category.main}&nbsp;</dd>

      <dt className="value-list__definition">Verantwoordelijke afdeling</dt>
      <dd className="value-list__value">{incident.category.department}</dd>

      <dt className="value-list__definition">Bron</dt>
      <dd className="value-list__value">{incident.source}</dd>

      {incident.parent_id ?
        (<span>
          <dt className="value-list__definition">Oorspronkelijke melding</dt>
          <dd className="value-list__value"><NavLink className="value-list__link" to={`/manage/incident/${incident.parent_id}`}>{incident.parent_id}</NavLink></dd>
        </span>)
        : ''}
      {incident.child_ids && incident.child_ids.length > 0 ?
        (<span>
          <dt className="value-list__definition">Gesplitst in</dt>
          <dd className="value-list__value">{incident.child_ids.map((child_id) =>
            (<NavLink className="value-list__link" key={child_id} to={`/manage/incident/${child_id}`}>{child_id}</NavLink>))}</dd>
        </span>)
        : ''}

    </dl>
  </div>
);

ValueList.propTypes = {
  incident: PropTypes.object.isRequired,
  priorityList: PropTypes.array.isRequired
};

export default ValueList;
// {getListValueByKey(stadsdeelList, incident.location.stadsdeel)}&nbsp
