import moment from 'moment';

import mapValues from '../map-values';
import mapPaths from '../map-paths';

export const defaultParams = {
  reporter: {},
};

export default (incident, wizard) => {
  let datetime;

  if (incident.datetime && incident.datetime.id === 'Nu') {
    datetime = moment();
  } else if (incident.incident_date) {
    const date =
      incident.incident_date && incident.incident_date === 'Vandaag'
        ? moment().format('YYYY-MM-DD')
        : incident.incident_date;

    const time = `${incident.incident_time_hours}:${incident.incident_time_minutes}`;

    datetime = moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm');
  }

  let params = defaultParams;

  if (datetime) {
    params.incident_date_start = datetime.format();
  }

  params = mapValues(params, incident, wizard);
  params = mapPaths(params, incident, wizard);

  return params;
};
