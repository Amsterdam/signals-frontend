import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import parseISO from 'date-fns/parseISO';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import { string2date, string2time } from 'shared/services/string-parser';
import { getListValueByKey } from 'shared/services/list-helper/list-helper';
import * as types from 'shared/types';

import './style.scss';

class List extends React.Component {
  onSort = sort => () => {
    const sortIsAsc = this.props.sort && this.props.sort.indexOf(sort) === 0;

    this.props.onChangeOrdering(sortIsAsc ? `-${sort}` : sort);
  }

  getDaysOpen(incident) {
    const statusesWithoutDaysOpen = ['o', 'a', 's', 'reopen requested'];
    if (incident.status && !statusesWithoutDaysOpen.includes(incident.status.state)) {
      const start = parseISO(incident.created_at);
      return -differenceInCalendarDays(start, new Date());
    }

    return '-';
  }

  sortClassName(sortName) {
    let className = '';
    const currentSort = this.props.sort && this.props.sort.split(',')[0];
    if (currentSort && currentSort.indexOf(sortName) > -1) {
      className = currentSort.charAt(0) === '-' ? 'sort sort-down' : 'sort sort-up';
    }
    return className;
  }

  render() {
    const { incidents, priority, status, stadsdeel } = this.props;
    return (
      <div className="list-component" data-testid="incidentOverviewListComponent">
        <div className="list-component__body">
          <table className="list-component__table" cellSpacing="0" cellPadding="0">
            <thead>
              <tr>
                <th onClick={this.onSort('id')} className={this.sortClassName('id')}>Id</th>
                <th onClick={this.onSort('days_open')} className={this.sortClassName('days_open')}>Dag</th>
                <th onClick={this.onSort('created_at')} className={this.sortClassName('created_at')}>Datum en tijd</th>
                <th onClick={this.onSort('stadsdeel,-created_at')} className={this.sortClassName('stadsdeel')}>Stadsdeel</th>
                <th onClick={this.onSort('sub_category,-created_at')} className={this.sortClassName('sub_category')}>Subcategorie</th>
                <th onClick={this.onSort('status,-created_at')} className={this.sortClassName('status')}>Status</th>
                <th onClick={this.onSort('priority,-created_at')} className={this.sortClassName('priority')}>Urgentie</th>
                <th onClick={this.onSort('address,-created_at')} className={this.sortClassName('address')}>Adres</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map(incident => {
                const detailLink = `/manage/incident/${incident.id}`;
                return (
                  <tr key={incident.id}>
                    <td><Link to={detailLink}>{incident.id}</Link></td>
                    <td data-testid="incidentDaysOpen"><Link to={detailLink}>{this.getDaysOpen(incident)}</Link></td>
                    <td className="no-wrap"><Link to={detailLink}>{string2date(incident.created_at)} {string2time(incident.created_at)}</Link></td>
                    <td><Link to={detailLink}>{getListValueByKey(stadsdeel, incident.location && incident.location.stadsdeel)}</Link></td>
                    <td><Link to={detailLink}>{incident.category && incident.category.sub}</Link></td>
                    <td><Link to={detailLink}>{getListValueByKey(status, incident.status && incident.status.state)}</Link></td>
                    <td><Link to={detailLink}>{getListValueByKey(priority, incident.priority && incident.priority.priority)}</Link></td>
                    <td><Link to={detailLink}>{incident.location && incident.location.address_text}</Link></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div >
    );
  }
}

List.propTypes = {
  incidents: PropTypes.arrayOf(types.incidentType).isRequired,
  priority: types.dataListType.isRequired,
  status: types.dataListType.isRequired,
  stadsdeel: types.dataListType.isRequired,

  onChangeOrdering: PropTypes.func.isRequired,
  sort: PropTypes.string,
};

export default List;
