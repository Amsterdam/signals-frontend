import React from 'react';
import PropTypes from 'prop-types';

import { string2date, string2time } from 'shared/services/string-parser/string-parser';
import './style.scss';

class IncidentDetail extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { incident } = this.props;
    const extraProperties = incident.extra_properties && Object.keys(incident.extra_properties).map((key) =>
      (<tr key={key}><td>{key}</td><td>{incident.extra_properties[key]}&nbsp;</td></tr>)
    );
    return (
      <div className="incident-detail">
        <div className="incident-detail__body">
          <table className="" cellSpacing="0" cellPadding="0">
            <tbody>
              <tr><td>Datum</td><td>{string2date(incident.created_at)}</td></tr>
              <tr><td>Tijd</td><td>{string2time(incident.created_at)}</td></tr>
              <tr><td>Datum overlast</td><td>{string2date(incident.incident_date_start)}</td></tr>
              <tr><td>Tijd overlast</td><td>{string2time(incident.incident_date_start)}</td></tr>
              <tr><td>Rubriek</td><td>{incident.category.sub}&nbsp;</td></tr>
              <tr><td>Omschrijving</td><td>{incident.text}&nbsp;</td></tr>
              <tr><td>Aanvullende kenmerken</td><td>{incident.text_extra}&nbsp;</td></tr>
              {extraProperties}
              <tr><td>Stadsdeel</td><td>{incident.location.stadsdeel}</td></tr>
              <tr><td>Adres</td><td>{incident.location.address_text}</td></tr>
              <tr><td>Email</td><td>{incident.reporter.email}</td></tr>
              <tr><td>Telefoonnummer</td><td>{incident.reporter.phone}</td></tr>
              <tr><td>Bron</td><td>{incident.source}</td></tr>
              <tr><td>Verantwoordelijke afdeling</td><td>{incident.category.department}&nbsp;</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

IncidentDetail.propTypes = {
  incident: PropTypes.object.isRequired
};

export default IncidentDetail;
