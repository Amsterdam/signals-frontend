import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import parseISO from 'date-fns/parseISO';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import { string2date, string2time } from 'shared/services/string-parser';
import { getListValueByKey } from 'shared/services/list-helper/list-helper';
import * as types from 'shared/types';
import configuration from 'shared/services/configuration/configuration';

import './style.scss';
import IncidentManagementContext from '../../../../context';

const sortColumn = (currentSort, onChangeOrdering) => newSort => () => {
  const sortIsAsc = currentSort && currentSort.indexOf(newSort) === 0;

  onChangeOrdering(sortIsAsc ? `-${newSort}` : newSort);
};

const getDaysOpen = incident => {
  const statusesWithoutDaysOpen = ['o', 'a', 's', 'reopen requested'];
  const hasDaysOpen = incident.status && !statusesWithoutDaysOpen.includes(incident.status.state);
  const start = hasDaysOpen && parseISO(incident.created_at);
  return hasDaysOpen ? -differenceInCalendarDays(start, new Date()) : '-';
};

const sortClassName = sort => sortName => {
  const sortString = sort && sort.charAt(0) === '-' ? 'sort sort-down' : 'sort sort-up';
  const currentSort = sort && sort.split(',')[0];
  return currentSort && currentSort.indexOf(sortName) > -1 ? sortString : '';
};

const List = ({ incidents, onChangeOrdering, priority, sort, status, stadsdeel }) => {
  const { districts } = useContext(IncidentManagementContext);
  const onSort = sortColumn(sort, onChangeOrdering);
  const getSortClassName = sortClassName(sort);

  return (
    <div className="list-component" data-testid="incidentOverviewListComponent">
      <div className="list-component__body">
        <table className="list-component__table" cellSpacing="0" cellPadding="0">
          <thead>
            <tr>
              <th onClick={onSort('id')} className={getSortClassName('id')}>
                Id
              </th>
              <th onClick={onSort('days_open')} className={getSortClassName('days_open')}>
                Dag
              </th>
              <th onClick={onSort('created_at')} className={getSortClassName('created_at')}>
                Datum en tijd
              </th>
              {configuration.useAreasInsteadOfStadsdeel ? (
                <th onClick={onSort('district,-created_at')} className={getSortClassName('district')}>
                  {configuration.language.district}
                </th>
              ) : (
                <th onClick={onSort('stadsdeel,-created_at')} className={getSortClassName('stadsdeel')}>
                  Stadsdeel
                </th>
              )}
              <th onClick={onSort('sub_category,-created_at')} className={getSortClassName('sub_category')}>
                Subcategorie
              </th>
              <th onClick={onSort('status,-created_at')} className={getSortClassName('status')}>
                Status
              </th>
              <th onClick={onSort('priority,-created_at')} className={getSortClassName('priority')}>
                Urgentie
              </th>
              <th onClick={onSort('address,-created_at')} className={getSortClassName('address')}>
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
                  {configuration.useAreasInsteadOfStadsdeel ? (
                    <td>
                      <Link to={detailLink}>
                        {getListValueByKey(districts, incident.location && incident.location.area_code)}
                      </Link>
                    </td>
                  ) : (
                    <td>
                      <Link to={detailLink}>
                        {getListValueByKey(stadsdeel, incident.location && incident.location.stadsdeel)}
                      </Link>
                    </td>
                  )}
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
  priority: types.dataListType.isRequired,
  status: types.dataListType.isRequired,
  stadsdeel: types.dataListType.isRequired,

  onChangeOrdering: PropTypes.func.isRequired,
  sort: PropTypes.string,
};

export default List;
