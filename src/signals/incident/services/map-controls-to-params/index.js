import moment from 'moment';

import mapValues from '../map-values';
import mapPaths from '../map-paths';

const mapControlsToParams = (incident, wizard) => {
  let date;

  if (incident.datetime && incident.datetime.id === 'Nu') {
    date = moment();
  } else if (incident.incident_date) {
    const time = `${incident.incident_time_hours}:${incident.incident_time_minutes}`;
    date = moment(`${incident.incident_date && incident.incident_date === 'Vandaag' ? moment().format('YYYY-MM-DD') : incident.incident_date} ${time}`, 'YYYY-MM-DD HH:mm');
  }

  let params = {
    reporter: {},
    status: {
      state: 'm',
      extra_properties: {}
    }
  };

  if (date) {
    params.incident_date_start = date.format();
  }

  params = mapValues(params, incident, wizard);
  params = mapPaths(params, incident, wizard);

  return params;
};

export default mapControlsToParams;
