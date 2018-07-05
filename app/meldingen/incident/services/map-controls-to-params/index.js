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

/*
{
  "source": "string",
  "text": "string",
  "text_extra": "string",
  "status": {
    "text": "string",
    "user": "user@example.com",
    "target_api": "string",
    "state": "m",
    "extern": true,
    "extra_properties": "string"
  },
  "location": {
    "stadsdeel": "A",
    "buurt_code": "string",
    "address": "string",
    "geometrie": "string",
    "extra_properties": "string"
  },
  "category": {
    "main": "string",
    "sub": "string",
    "department": "string",
    "priority": 0
  },
  "reporter": {
    "email": "user@example.com",
    "phone": "string",
    "remove_at": "2018-07-03T13:49:38.737Z",
    "extra_properties": "string"
  },
  "created_at": "2018-07-03T13:49:38.737Z",
  "updated_at": "2018-07-03T13:49:38.737Z",
  "incident_date_start": "2018-07-03T13:49:38.737Z",
  "incident_date_end": "2018-07-03T13:49:38.737Z",
  "operational_date": "2018-07-03T13:49:38.737Z"
}
*/
