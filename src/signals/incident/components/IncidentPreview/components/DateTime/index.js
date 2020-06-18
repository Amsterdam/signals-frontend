import PropTypes from 'prop-types';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';

const getValue = (value, incident) => {
  if (value && value.id === 'Nu') {
    return 'Nu';
  }
  if (!incident) {
    return '';
  }

  const time = format(parse(`${incident.incident_time_hours}:${incident.incident_time_minutes}`, 'H:m'),('H:mm'));
  if (incident.incident_date === 'Vandaag') {
    return `Vandaag, ${time}`;
  }

  return `${format(parseISO(incident.incident_date),'dddd D MMMM')}, ${time}`;
};

const DateTime = ({ value, incident }) => getValue(value, incident);

DateTime.propTypes = {
  value: PropTypes.shape({}),
  incident: PropTypes.shape({}),
};

export default DateTime;
