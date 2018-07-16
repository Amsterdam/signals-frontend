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
    const { incidents, incidentsCount, statusList } = this.props;
    return (
      <div className="list-component">
        <div className="list-component__title">Meldingen ({incidentsCount})</div>

        <div className="list-component__body">
          <table className="" cellSpacing="0" cellPadding="0">
            <thead>
              <tr>
                <th className="">Id</th>
                <th className="">Datum</th>
                <th className="">Tijd</th>
                <th className="">Stadsdeel</th>
                <th className="">Rubriek</th>
                <th className="">Afdeling</th>
                <th className="">Status</th>
                <th className="">Adres</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((incident) => (
                <tr key={incident.id} onClick={this.selectIncident(incident)}>
                  <td>{incident.id}</td>
                  <td>{string2date(incident.incident_date_start)}</td>
                  <td>{string2time(incident.incident_date_start)}</td>
                  <td>{incident.location.stadsdeel}</td>
                  <td>{incident.category.sub}</td>
                  <td>{incident.category.department}</td>
                  <td>{getListValueByKey(statusList, incident.status.state)}</td>
                  <td>{incident.location.address.openbare_ruimte} {incident.location.address.huisnummer}</td>
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
  statusList: PropTypes.array.isRequired,

  incidentSelected: PropTypes.func.isRequired,
};

export default List;
