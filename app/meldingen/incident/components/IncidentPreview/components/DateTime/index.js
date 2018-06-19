import React from 'react';
import PropTypes from 'prop-types';

function getValue(value, incident) {
  if (value === 'now') {
    return 'Nu';
  }
  console.log('--------------------------------', incident.incident_time_hours, incident.incident_time_minutes);
  return value;
}

const DateTime = ({ label, value, incident }) => (
  <span>
    {console.log('incident', incident)}
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
