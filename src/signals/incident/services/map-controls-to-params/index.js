import moment from 'moment';
import { forEach, set } from 'lodash';

const mapControlsToParams = (incident, wizard) => {
  const time = `${incident.incident_time_hours}:${incident.incident_time_minutes}`;
  let date;

  if (incident.datetime === 'Nu') {
    date = moment();
  } else {
    date = moment(`${incident.incident_date === 'Vandaag' ? moment().format('YYYY-MM-DD') : incident.incident_date} ${time}`, 'YYYY-MM-DD');
  }

  const params = {
    created_at: date,
    incident_date_start: date,
    status: {
      state: 'm',
      extra_properties: {}
    }
  };

  const map = [];
  let mapMerge = {};
  forEach(wizard, (step) => {
    const controls = step.form && step.form.controls;
    forEach(controls, (control, name) => {
      if (control.meta && control.meta.path) {
        map.push({
          path: control.meta.path,
          value: incident[name]
        });
      }

      if (control.meta && control.meta.pathMerge && incident[name]) {
        mapMerge = {
          ...mapMerge,
          [control.meta.pathMerge]: {
            ...mapMerge[control.meta.pathMerge],
            [control.meta.label || name]: incident[name]
          }
        };
      }
    });
  });

  forEach(map, (item) => {
    set(params, item.path, item.value);
  });

  forEach(mapMerge, (item, key) => {
    set(params, key, item);
  });

  return params;
};

export default mapControlsToParams;
