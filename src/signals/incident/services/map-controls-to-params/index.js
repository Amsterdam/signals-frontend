import moment from 'moment';

import mapValues from '../map-values';
import mapPaths from '../map-paths';

const mapControlsToParams = (incident, wizard) => {
  console.log('mapControlsToParams', incident);
  let datetime;


  if (incident.datetime && incident.datetime.id === 'Nu') {
    datetime = moment();
  } else if (incident.incident_date) {
    const date = incident.incident_date && incident.incident_date === 'Vandaag' ? moment().format('YYYY-MM-DD') : incident.incident_date;
    const time = `${incident.incident_time_hours}:${incident.incident_time_minutes}`;
    datetime = moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm');
  }

  let params = {
    reporter: {},
    status: {
      state: 'm',
      extra_properties: {}
    }
  };

  if (datetime) {
    params.incident_date_start = datetime.format();
  }

  console.log('mapControlsToParams mapValues');
  params = mapValues(params, incident, wizard);
  console.log('mapControlsToParams mapPaths');
  params = mapPaths(params, incident, wizard);

  console.log('mapControlsToParams output', params);
  return params;
};

export default mapControlsToParams;
