import moment from 'moment';
// import { map, filter, flatMap, concat } from 'lodash';

const mapControlsToParams = (incident /* , wizard */) => {
  console.log('mapControlsToParams', incident);
  // const yoooo = map(wizard, (step) => {
  //   const controls = step.form && step.form.controls;
  //   const yo = flatMap(controls, (control, name) => {
  //     if (control.meta && control.meta.param) {
  //       console.log('control', name, control.meta.param);
  //       return control.meta.param;
  //     }
  //   });
  //   console.log('yo', yo);
  // });
  // console.log('YOOOOO', yoooo);

  // create date
  let date;
  switch (incident.incident_date) {
    case 'now':
      date = moment();
      break;
    default:
      date = moment(`${incident.incident_date} ${incident.incident_time_hours}:${incident.incident_time_minutes}`);
  }

  const result = {
    text: incident.description,
    text_extra: 'text_extra',

    created_at: date.format(),
    incident_date_start: date.format(),

    category: {
      main: incident.category,
      sub: incident.subcategory,
      department: 'WaterNet'
    },

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

    reporter: {
      email: incident.email,
      phone: incident.phone
    },

    status: {
      state: 'm',
      text: '42',
      extra_properties: {}
    }
  };

  return result;
};

export default mapControlsToParams;
