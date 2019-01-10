import moment from 'moment';

import mapControlsToParams from './index';

jest.mock('moment');

describe('The map controls to params service', () => {
  it('should map status by default', () => {
    expect(mapControlsToParams({}, {})).toEqual({
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
      datetime: 'Nu'
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
      incident_date: 'Vandaag'
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

  it('should map variables when they are present in the wizard definition', () => {
    expect(mapControlsToParams({
      description: 'bar',
      title: 666
    }, {
      step: {
        form: {
          controls: {
            description: {
              meta: {
                path: 'text'
              }
            },
            title: {
              meta: {
                path: 'diabolo'
              }
            },
            var_no_path: {}
          }
        }
      }
    })).toMatchObject({
      text: 'bar',
      diabolo: 666
    });
  });

  it('should merge multiple variables into 1 object', () => {
    expect(mapControlsToParams({
      description: 'bar',
      title: 666
    }, {
      step: {
        form: {
          controls: {
            description: {
              meta: {
                pathMerge: 'extra_properties',
              }
            },
            title: {
              meta: {
                pathMerge: 'extra_properties',
              }
            },
            var_no_path: {}
          }
        }
      }
    })).toMatchObject({
      extra_properties: {
        description: 'bar',
        title: 666
      }
    });
  });
});
