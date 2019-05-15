import moment from 'moment';

import mapControlsToParams from './index';

jest.mock('moment');
// jest.mock('../map-values');
// jest.mock('../map-paths');

describe('The map controls to params service', () => {
  it('should map status by default', () => {
    expect(mapControlsToParams({}, {})).toEqual({
      reporter: {},
      status: {
        state: 'm',
        extra_properties: {}
      }
    });
  });

  it('should map date: Nu', () => {
    moment.mockImplementation(() => ({
      format: () => '2018-07-21T12:34:00+02:00'
    }));

    expect(mapControlsToParams({
      incident_time_hours: 12,
      incident_time_minutes: 34,
      datetime: {
        id: 'Nu',
        label: 'Nu'
      }
    }, {})).toMatchObject({
      incident_date_start: '2018-07-21T12:34:00+02:00'
    });
  });

  it('should map date: Vandaag', () => {
    moment.mockImplementation(() => ({
      format: () => '2018-07-21T10:21:00+02:00'
    }));

    expect(mapControlsToParams({
      incident_time_hours: 10,
      incident_time_minutes: 21,
      incident_date: {
        id: 'Vandaag',
        label: 'Vandaag'
      }
    }, {})).toMatchObject({
      incident_date_start: '2018-07-21T10:21:00+02:00'
    });
  });

  it('should map date: fixed date', () => {
    moment.mockImplementation(() => ({
      format: () => '2018-07-02T09:05:00+02:00'
    }));

    expect(mapControlsToParams({
      incident_time_hours: 9,
      incident_time_minutes: 5,
      incident_date: '2018-04-02'
    }, {})).toMatchObject({
      incident_date_start: '2018-07-02T09:05:00+02:00'
    });
  });
});
