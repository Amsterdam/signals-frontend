import format from 'date-fns/format';
import formatISO from 'date-fns/formatISO';
import parse from 'date-fns/parse';
import mapValues from '../map-values';
import mapPaths from '../map-paths';

const mapControlsToParams = (incident, wizard) => {
  let datetime;
  if (incident.datetime && incident.datetime.id === 'Nu') {
    datetime = new Date();
  } else if (incident.incident_date) {
    const date =
      incident.incident_date && incident.incident_date === 'Vandaag' ?
        format(new Date(), 'yyyy-MM-dd') :
        incident.incident_date;

    const datetimeString = `${date} ${String(incident.incident_time_hours).padStart(2, '0')}:${String(
      incident.incident_time_minutes
    ).padStart(2, '0')}`;
    datetime = parse(datetimeString, 'yyyy-MM-dd HH:mm', new Date());
  }

  let params = {
    reporter: {},
  };

  if (datetime) {
    params.incident_date_start = formatISO(datetime);
  }

  params = mapValues(params, incident, wizard);
  params = mapPaths(params, incident, wizard);

  return params;
};

export default mapControlsToParams;
