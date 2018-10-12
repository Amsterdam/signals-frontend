import React from 'react';
import PropTypes from 'prop-types';

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

  selectIncident = (incident) => () => {
    this.props.incidentSelected(incident);
  }

  render() {
    const { incidents, incidentsCount, priorityList, statusList, stadsdeelList } = this.props;
    return (
      <div className="list-component">
        <div className="list-component__title">Meldingen ({incidentsCount})</div>

        <div className="list-component__body">
          <table cellSpacing="0" cellPadding="0">
            <thead>
              <tr>
                <th onClick={this.onSort('id')}>Id</th>
                <th onClick={this.onSort('created_at')}>Datum / Tijd</th>
                <th onClick={this.onSort('stadsdeel,-created_at')}>Stadsdeel</th>
                <th onClick={this.onSort('sub_category,-created_at')}>Subcategorie</th>
                <th onClick={this.onSort('state,-created_at')}>Status</th>
                <th onClick={this.onSort('priority__priority,-created_at')}>Urgentie</th>
                <th onClick={this.onSort('address,-created_at')}>Adres</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((incident) => (
                <tr key={incident.id} onClick={this.selectIncident(incident)}>
                  <td>{incident.id}</td>
                  <td className="no-wrap">{string2date(incident.incident_date_start)} / {string2time(incident.incident_date_start)}</td>
                  <td>{getListValueByKey(stadsdeelList, incident.location.stadsdeel)}</td>
                  <td>{incident.category.sub}</td>
                  <td>{getListValueByKey(statusList, incident.status.state)}</td>
                  <td>{getListValueByKey(priorityList, incident.priority && incident.priority.priority)}</td>
                  <td>{incident.location.address_text}</td>
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
  incidentsCount: PropTypes.number,
  incidents: PropTypes.array.isRequired,
  priorityList: PropTypes.array.isRequired,
  statusList: PropTypes.array.isRequired,
  stadsdeelList: PropTypes.array.isRequired,

  incidentSelected: PropTypes.func.isRequired,
  onRequestIncidents: PropTypes.func.isRequired,
  sort: PropTypes.string
};

export default List;
