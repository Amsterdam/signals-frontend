import moment from 'moment';
import { forEach, set, isFunction } from 'lodash';

const setValue = (value) => {
  if (value === true) {
    return 'ja';
  }
  if (value === false) {
    return 'nee';
  }
  return value;
};

const mapControlsToParams = (incident, wizard) => {
  let date;

  if (incident.datetime === 'Nu') {
    date = moment();
  } else if (incident.incident_date) {
    const time = `${incident.incident_time_hours}:${incident.incident_time_minutes}`;
    date = moment(`${incident.incident_date === 'Vandaag' ? moment().format('YYYY-MM-DD') : incident.incident_date} ${time}`, 'YYYY-MM-DD HH:mm');
  }

  const params = {
    status: {
      state: 'm',
      extra_properties: {}
    }
  };

  if (date) {
    params.incident_date_start = date.format();
  }

  const map = [];
  let mapMerge = {};
  forEach(wizard, (step) => {
    let controls = {};
    if (step.formFactory && isFunction(step.formFactory)) {
      const form = step.formFactory(incident);
      controls = form && form.controls;
    } else {
      controls = step.form && step.form.controls;
    }
    forEach(controls, (control, name) => {
      const value = incident[name];
      const meta = control.meta;

      if (meta && meta.path) {
        map.push({
          path: meta.path,
          value
        });
      }

      if (meta && meta.isVisible && meta.pathMerge && (value || value === false || value === 0)) {
        mapMerge = {
          ...mapMerge,
          [meta.pathMerge]: {
            ...mapMerge[meta.pathMerge],
            [meta.label || meta.value || name]: setValue(value)
          }
        };
      }
    });
  });

  forEach(map, (item) => {
    set(params, item.path, setValue(item.value));
  });

  forEach(mapMerge, (value, key) => {
    set(params, key, value);
  });

  return params;
};

export default mapControlsToParams;
