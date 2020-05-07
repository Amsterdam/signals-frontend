import PropTypes from 'prop-types';
import moment from 'moment';

const getValue = (value, incident) => {
  if (value && value.id === 'Nu') {
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
};

const DateTime = ({ value, incident }) => getValue(value, incident);

DateTime.propTypes = {
  value: PropTypes.shape({}),
  incident: PropTypes.shape({}),
};

export default DateTime;
