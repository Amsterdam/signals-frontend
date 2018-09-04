import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

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
  <span>
    {!optional || (optional && value) ?
      <span>
        <span className="preview-item-label">{label}</span>
        <span className="preview-item-value">{getValue(value, incident)}</span>
      </span>
      : ''}
  </span>
);

DateTime.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  incident: PropTypes.object,
  optional: PropTypes.bool
};

export default DateTime;
