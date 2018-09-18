import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import './style.scss';

function getValue(value, incident) {
  if (value === 'Nu') {
    return 'Nu';
  }
  if (!incident) {
    return '';
  }

  const time = moment(`${incident.incident_time_hours}:${incident.incident_time_minutes}`, 'H:m').format('H:mm');
  if (incident.incident_date === 'Vandaag') {
    return `Vandaag, ${time}`;
  }

  return `${moment(incident.incident_date).format('dddd D MMMM')}, ${time}`;
}

const DateTime = ({ label, value, optional, incident }) => (
  <div className="preview-datetime">
    {!optional || (optional && value) ?
      <div className="row">
        <div className="col-5 col-md-4">
          <div className="preview-datetime__item-label">{label}</div>
        </div>
        <div className="col-5 col-md-7">
          <div className="preview-datetime__item-value">{getValue(value, incident)}</div>
        </div>
      </div>
      : ''}
  </div>
);

DateTime.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  incident: PropTypes.object,
  optional: PropTypes.bool
};

export default DateTime;
