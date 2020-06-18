import PropTypes from 'prop-types';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import { capitalizeFirstLetter } from 'shared/services/date-utils';
import parseISO from 'date-fns/parseISO';
import { nl } from 'date-fns/locale';

const getValue = (value, incident) => {
  if (value && value.id === 'Nu') {
    return 'Nu';
  }
  if (!incident) {
    return '';
  }

  const time = format(parse(`${incident.incident_time_hours}:${incident.incident_time_minutes}`, 'H:m', new Date()), ('H:mm'));
  if (incident.incident_date === 'Vandaag') {
    return `Vandaag, ${time}`;
  }

  return `${capitalizeFirstLetter(format(parseISO(incident.incident_date), 'EEEE d MMMM', { locale: nl }))}, ${time}`;
};

const DateTime = ({ value, incident }) => getValue(value, incident);

DateTime.propTypes = {
  value: PropTypes.shape({}),
  incident: PropTypes.shape({}),
};

export default DateTime;
