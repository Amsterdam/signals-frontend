import React from 'react';
import PropTypes from 'prop-types';

import { string2date, string2time } from 'shared/services/string-parser/string-parser';
import { getListValueByKey } from 'shared/services/list-helper/list-helper';
import './style.scss';

class List extends React.Component { // eslint-disable-line react/prefer-stateless-function
  selectIncident = (incident) => () => {
    this.props.incidentSelected(incident);
  }

  render() {
    const { incidents, incidentsCount, priorityList, statusList, stadsdeelList } = this.props;
    return (
      <div className="list-component">
        <div className="list-component__title">Meldingen ({incidentsCount})</div>

        <div className="list-component__body">
          <table className="" cellSpacing="0" cellPadding="0">
            <thead>
              <tr>
                <th className="list-component__body-col-1">Id<br />Subcategorie</th>
                <th className="list-component__body-col-2">Datum<br />Tijd</th>
                <th className="list-component__body-col-3">Stadsdeel<br />Adres</th>
                <th className="list-component__body-col-4">Status<br />Urgentie<br />Afdeling</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((incident) => (
                <tr key={incident.id} onClick={this.selectIncident(incident)}>
                  <td>{incident.id}<br />{incident.category.sub}</td>
                  <td>{string2date(incident.incident_date_start)}<br />{string2time(incident.incident_date_start)}</td>
                  <td>{getListValueByKey(stadsdeelList, incident.location.stadsdeel)}<br />{incident.location.address_text}</td>
                  <td>{getListValueByKey(statusList, incident.status.state)}<br />{getListValueByKey(priorityList, incident.priority && incident.priority.priority)}<br />{incident.category.department}</td>
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
};

export default List;
