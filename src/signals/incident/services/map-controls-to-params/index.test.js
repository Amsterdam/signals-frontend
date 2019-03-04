import moment from 'moment';

import mapControlsToParams from './index';

jest.mock('moment');

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
      title: 42,
      undefined_value: undefined,
      value_0: 0,
      value_false: false,
      value_true: true
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
                path: 'meaningOfLife'
              }
            },
            value_0: {
              meta: {
                path: 'value_0'
              }
            },
            value_false: {
              meta: {
                path: 'value_false'
              }
            },
            value_true: {
              meta: {
                path: 'value_true'
              }
            },
            var_no_path: {}
          }
        }
      }
    })).toMatchObject({
      reporter: {},
      status: {
        state: 'm',
        extra_properties: {}
      },
      text: 'bar',
      meaningOfLife: 42,
      value_0: 0,
      value_false: 'nee',
      value_true: 'ja'
    });
  });

  it('should map variables when they are present in the wizard definition - via form factory', () => {
    expect(mapControlsToParams({
      description: 'bar',
      title: 42
    }, {
      step: {
        formFactory: () => ({
          controls: {
            description: {
              meta: {
                path: 'text'
              }
            },
            title: {
              meta: {
                path: 'meaningOfLife'
              }
            }
          }
        })
      }
    })).toMatchObject({
      text: 'bar',
      meaningOfLife: 42
    });
  });

  it('should merge all visible variables into 1 object', () => {
    expect(mapControlsToParams({
      description: 'bar',
      title: 42,
      value_0: 0,
      value_false: false,
      value_true: true
    }, {
      step: {
        form: {
          controls: {
            description: {
              meta: {
                pathMerge: 'extra_properties',
                isVisible: true
              }
            },
            title: {
              meta: {
                pathMerge: 'extra_properties',
                isVisible: false
              }
            },
            value_0: {
              meta: {
                pathMerge: 'extra_properties',
                isVisible: true
              }
            },
            value_false: {
              meta: {
                pathMerge: 'extra_properties',
                isVisible: true
              }
            },
            value_true: {
              meta: {
                pathMerge: 'extra_properties',
                isVisible: true
              }
            },
            var_no_path: {}
          }
        }
      }
    })).toMatchObject({
      extra_properties: {
        description: 'bar',
        value_0: 0,
        value_false: 'nee',
        value_true: 'ja'
      },
      reporter: {},
      status: {
        state: 'm',
        extra_properties: {}
      }
    });
  });
});
