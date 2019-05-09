import moment from 'moment';
import { forEach, set, isFunction, isObject } from 'lodash';

const setValue = (value) => {
  if (value === 0) {
    return 0;
  }
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
    reporter: {},
    status: {
      state: 'm',
      extra_properties: {}
    }
  };

  if (date) {
    params.incident_date_start = date.format();
  }

  const subcategoryLink = new URL(incident.subcategory_link);
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

      if (meta && meta.isVisible && meta.pathMerge) {
        const answer = setValue(value);
        if (answer || answer === 0) {
          mapMerge = {
            ...mapMerge,
            [meta.pathMerge]: [
              ...(mapMerge[meta.pathMerge] || []),
              {
                id: name,
                label: meta.label,
                category_url: subcategoryLink.pathname,
                answer
              }
            ]
          };
        }
      }
    });
  });

  forEach(map, (item) => {
    let itemValue = setValue(item.value);
    if (itemValue || itemValue === 0) {
      if (isObject(itemValue) && itemValue.id) {
        itemValue = itemValue.id;
      }

      set(params, item.path, itemValue);
    }
  });

  forEach(mapMerge, (value, key) => {
    set(params, key, value);
  });

  return params;
};

export default mapControlsToParams;
