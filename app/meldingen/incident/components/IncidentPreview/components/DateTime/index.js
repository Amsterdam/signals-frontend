import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

function getValue(value, incident) {
  if (value === 'now') {
    return 'Nu';
  }

  const time = moment(`${incident.incident_time_hours}:${incident.incident_time_minutes}`, 'H:m').format('H:mm');

  if (value === 'Vandaag') {
    return `Vandaag, ${time}`;
  }

  return `${moment(value).format('dddd D MMMM')}, ${time}`;
}

const DateTime = ({ label, value, incident }) => (
  <span>
    <span className="preview-item-label">{label}</span>
    <span className="preview-item-value">{getValue(value, incident)}</span>
  </span>
);

DateTime.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  incident: PropTypes.object
};

export default DateTime;
