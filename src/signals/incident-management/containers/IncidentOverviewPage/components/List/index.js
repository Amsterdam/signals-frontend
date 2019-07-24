import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { string2date, string2time } from 'shared/services/string-parser/string-parser';
import { getListValueByKey } from 'shared/services/list-helper/list-helper';
import './style.scss';

class List extends React.Component { // eslint-disable-line react/prefer-stateless-function
  onSort = (sort) => () => {
    if (this.props.sort && this.props.sort.indexOf(sort) === 0) {
      this.props.onRequestIncidents({ sort: `-${sort}` });
    } else {
      this.props.onRequestIncidents({ sort });
    }
  }

  getDaysOpen(incident) {
    if (incident.status && incident.status.state !== 'o' && incident.status.state !== 'a') {
      const start = moment(incident.created_at.split('T')[0]);
      const duration = moment.duration(moment().diff(start));
      return Math.trunc(duration.asDays());
    }
    return '-';
  }

  selectIncident = (incident) => () => {
    this.props.incidentSelected(incident);
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
    const { incidents, priorityList, statusList, stadsdeelList } = this.props;
    return (
      <div className="list-component">
        <div className="list-component__body">
          <table className="list-component__table" cellSpacing="0" cellPadding="0">
            <thead>
              <tr>
                <th onClick={this.onSort('id')} className={this.sortClassName('id')} >Id</th>
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
              {incidents.map((incident) => (
                <tr key={incident.id} onClick={this.selectIncident(incident)}>
                  <td>{incident.id}</td>
                  <td>{this.getDaysOpen(incident)}</td>
                  <td className="no-wrap">{string2date(incident.created_at)} {string2time(incident.created_at)}</td>
                  <td>{getListValueByKey(stadsdeelList, incident.location && incident.location.stadsdeel)}</td>
                  <td>{incident.category && incident.category.sub}</td>
                  <td>{getListValueByKey(statusList, incident.status && incident.status.state)}</td>
                  <td>{getListValueByKey(priorityList, incident.priority && incident.priority.priority)}</td>
                  <td>{incident.location && incident.location.address_text}</td>
                </tr>
              ))
              }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

List.propTypes = {
  incidents: PropTypes.array.isRequired,
  priorityList: PropTypes.array.isRequired,
  statusList: PropTypes.array.isRequired,
  stadsdeelList: PropTypes.array.isRequired,

  incidentSelected: PropTypes.func.isRequired,
  onRequestIncidents: PropTypes.func.isRequired,
  sort: PropTypes.string
};

export default List;
