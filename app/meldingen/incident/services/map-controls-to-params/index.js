import moment from 'moment';
import { forEach, set } from 'lodash';

const mapControlsToParams = (incident, wizard) => {
  const date = incident.incident_date === 'now' ? moment() : moment(`${incident.incident_date} ${incident.incident_time_hours}:${incident.incident_time_minutes}`);

  const params = {
    text_extra: 'text_extra',

    created_at: date.format(),
    incident_date_start: date.format(),

    location: {
      address: {
        openbare_ruimte: 'Dam',
        huisnummer: '1',
        huisletter: 'A',
        huisnummer_toevoeging: '1',
        postcode: '1012JS',
        woonplaats: 'Amsterdam'
      },
      buurt_code: 'abc',
      geometrie: {
        type: 'Point',
        coordinates: [
          incident.location.lat,
          incident.location.lng
        ]
      },
      stadsdeel: 'A',
      extra_properties: {}
    },

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

  return params;
};

export default mapControlsToParams;
