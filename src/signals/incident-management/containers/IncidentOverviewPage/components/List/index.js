import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import parseISO from 'date-fns/parseISO';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';

import { string2date, string2time } from 'shared/services/string-parser';
import { getListValueByKey } from 'shared/services/list-helper/list-helper';
import * as types from 'shared/types';
import { statusList } from 'signals/incident-management/definitions';

import './style.scss';

const List = ({ incidents, onChangeOrdering, priority, sort, stadsdeel, status }) => {
  const onSort = useCallback(
    srt => () => {
      const sortIsAsc = sort && sort.indexOf(srt) === 0;

      onChangeOrdering(sortIsAsc ? `-${srt}` : srt);
    },
    [onChangeOrdering, sort]
  );

  const getDaysOpen = useCallback(incident => {
    const statusesWithoutDaysOpen = statusList
      .filter(({ shows_remaining_sla_days }) => shows_remaining_sla_days === false)
      .map(({ key }) => key);

    if (incident.status && !statusesWithoutDaysOpen.includes(incident.status.state)) {
      const start = parseISO(incident.created_at);
      return -differenceInCalendarDays(start, new Date());
    }

    return '-';
  }, []);

  const sortClassName = useCallback(
    sortName => {
      let className = '';
      const currentSort = sort && sort.split(',')[0];

      if (currentSort && currentSort.indexOf(sortName) > -1) {
        className = currentSort.charAt(0) === '-' ? 'sort sort-down' : 'sort sort-up';
      }

      return className;
    },
    [sort]
  );

  return (
    <div className="list-component" data-testid="incidentOverviewListComponent">
      <div className="list-component__body">
        <table className="list-component__table" cellSpacing="0" cellPadding="0">
          <thead>
            <tr>
              <th onClick={onSort('id')} className={sortClassName('id')}>
                Id
              </th>
              <th onClick={onSort('days_open')} className={sortClassName('days_open')}>
                Dag
              </th>
              <th onClick={onSort('created_at')} className={sortClassName('created_at')}>
                Datum en tijd
              </th>
              <th onClick={onSort('stadsdeel,-created_at')} className={sortClassName('stadsdeel')}>
                Stadsdeel
              </th>
              <th onClick={onSort('sub_category,-created_at')} className={sortClassName('sub_category')}>
                Subcategorie
              </th>
              <th onClick={onSort('status,-created_at')} className={sortClassName('status')}>
                Status
              </th>
              <th onClick={onSort('priority,-created_at')} className={sortClassName('priority')}>
                Urgentie
              </th>
              <th onClick={onSort('address,-created_at')} className={sortClassName('address')}>
                Adres
              </th>
            </tr>
          </thead>
          <tbody>
            {incidents.map(incident => {
              const detailLink = `/manage/incident/${incident.id}`;
              return (
                <tr key={incident.id}>
                  <td>
                    <Link to={detailLink}>{incident.id}</Link>
                  </td>
                  <td data-testid="incidentDaysOpen">
                    <Link to={detailLink}>{getDaysOpen(incident)}</Link>
                  </td>
                  <td className="no-wrap">
                    <Link to={detailLink}>
                      {string2date(incident.created_at)} {string2time(incident.created_at)}
                    </Link>
                  </td>
                  <td>
                    <Link to={detailLink}>
                      {getListValueByKey(stadsdeel, incident.location && incident.location.stadsdeel)}
                    </Link>
                  </td>
                  <td>
                    <Link to={detailLink}>{incident.category && incident.category.sub}</Link>
                  </td>
                  <td>
                    <Link to={detailLink}>{getListValueByKey(status, incident.status && incident.status.state)}</Link>
                  </td>
                  <td>
                    <Link to={detailLink}>
                      {getListValueByKey(priority, incident.priority && incident.priority.priority)}
                    </Link>
                  </td>
                  <td>
                    <Link to={detailLink}>{incident.location && incident.location.address_text}</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

List.propTypes = {
  incidents: PropTypes.arrayOf(types.incidentType).isRequired,
  onChangeOrdering: PropTypes.func.isRequired,
  priority: types.dataListType.isRequired,
  sort: PropTypes.string,
  stadsdeel: types.dataListType.isRequired,
  status: types.dataListType.isRequired,
};

export default List;
