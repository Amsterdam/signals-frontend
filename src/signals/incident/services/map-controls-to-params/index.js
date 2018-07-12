import moment from 'moment';
import { forEach, set } from 'lodash';

const mapControlsToParams = (incident, wizard) => {
  const time = `${incident.incident_time_hours}:${incident.incident_time_minutes}`;
  let date;

  if (incident.datetime === 'Nu') {
    date = moment();
  } else {
    date = moment(`${incident.datetime === 'Vandaag' ? moment().format('YYYY-MM-DD') : incident.incident_date} ${time}`);
  }

  const params = {
    created_at: date.format(),
    incident_date_start: date.format(),
    status: {
      state: 'm',
      extra_properties: {}
    }
  };

  const map = [];
  forEach(wizard, (step) => {
    const controls = step.form && step.form.controls;
    forEach(controls, (control, name) => {
      if (control.meta && control.meta.path) {
        map.push({
          path: control.meta.path,
          value: incident[name]
        });
      }
    });
  });

  forEach(map, (item) => {
    set(params, item.path, item.value);
  });

  const textExtra = [];
  forEach(incident, (value, key) => {
    if (key.includes('extra_')) {
      textExtra.push(`${key}: ${value}`);
    }
  });
  params.text_extra = textExtra.join(', ');

  return params;
};

export default mapControlsToParams;
