import React from 'react';
import { Link } from 'react-router-dom';

import { string2date, string2time } from 'shared/services/string-parser/string-parser';
import { getListValueByKey } from 'shared/services/list-helper/list-helper';

const Body = ({ className, getDaysOpen, incidents, priority, status, stadsdeel }) =>
  incidents.map(incident => {
    const detailLink = `/manage/incident/${incident.id}`;

    return (
      <tr className={className} key={incident.id}>
        <td width={55}>
          <Link to={detailLink}>{incident.id}</Link>
        </td>
        <td data-testid="incidentDaysOpen" width={70}>
          <Link to={detailLink}>{getDaysOpen(incident)}</Link>
        </td>
        <td className="no-wrap" width={150}>
          <Link to={detailLink}>
            {string2date(incident.created_at)} {string2time(incident.created_at)}
          </Link>
        </td>
        <td width={115}>
          <Link to={detailLink}>{getListValueByKey(stadsdeel, incident.location && incident.location.stadsdeel)}</Link>
        </td>
        <td>
          <Link to={detailLink}>{incident.category && incident.category.sub}</Link>
        </td>
        <td>
          <Link to={detailLink}>{getListValueByKey(status, incident.status && incident.status.state)}</Link>
        </td>
        <td>
          <Link to={detailLink}>{getListValueByKey(priority, incident.priority && incident.priority.priority)}</Link>
        </td>
        <td>
          <Link to={detailLink}>{incident.location && incident.location.address_text}</Link>
        </td>
      </tr>
    );
  });

export default Body;
