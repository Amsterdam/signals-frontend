import moment from 'moment';
import { forEach, set, isFunction } from 'lodash';

const setValue = (value) => {
  switch (value) {
    case true:
      return 'ja';

    case false:
      return 'nee';

    case undefined:
      return '-';

    default:
      return value;
  }
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
      if (control.meta && control.meta.path) {
        map.push({
          path: control.meta.path,
          value: incident[name]
        });
      }

      if (control.meta && control.meta.pathMerge) {
        mapMerge = {
          ...mapMerge,
          [control.meta.pathMerge]: {
            ...mapMerge[control.meta.pathMerge],
            [control.meta.label || name]: setValue(incident[name])
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
