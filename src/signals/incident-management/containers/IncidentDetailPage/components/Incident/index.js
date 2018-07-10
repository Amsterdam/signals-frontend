import React from 'react';
import PropTypes from 'prop-types';

import { string2date, string2time } from 'shared/services/string-parser/string-parser';
import './style.scss';

class Incident extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { incident } = this.props;
    return (
      <div className="incident">
        <dl className="horizontal">
          <dt>Datum</dt><dd>{string2date(incident.created_at)}</dd>
          <dt>Tijd</dt><dd>{string2time(incident.created_at)}</dd>
          <dt>Datum overlast</dt><dd>{string2date(incident.incident_date_start)}</dd>
          <dt>Tijd overlast</dt><dd>{string2time(incident.incident_date_start)}</dd>
          <dt>Rubriek</dt><dd>{incident.category.sub}&nbsp;</dd>
          <dt>Onschrijving</dt><dd>{incident.text}&nbsp;</dd>
          <dt>Aanvullende kenmerken</dt><dd>{incident.text_extra}&nbsp;</dd>
          <dt>Naam boot (?)</dt><dd>Specifiek!????&nbsp;</dd>
          <dt>Stadsdeel</dt><dd>{incident.location.stadsdeel}</dd>
          <dt>Adres</dt><dd>{incident.location.address_text}</dd>
          <dt>Email</dt><dd>{incident.reporter.email}</dd>
          <dt>Telefoonnummer</dt><dd>{incident.reporter.phone}</dd>
          <dt>Bron</dt><dd>{incident.source}</dd>
          <dt>Verantwoordelijke afdeling</dt><dd>{incident.category.department}&nbsp;</dd>
        </dl>
      </div>
    );
  }
}

Incident.propTypes = {
  incident: PropTypes.object.isRequired
};

export default Incident;
