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

  it('should map variables when they are present in the wizard definition', () => {
    expect(mapControlsToParams({
      description: 'bar',
      title: 42,
      object: { id: '42', label: 'yooooo' },
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
            object: {
              meta: {
                path: 'colors'
              }
            },
            undefined_value: {
              meta: {
                path: 'undefined_value'
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
      colors: '42',
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
    const category_url = '/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/straatverlichting-openbare-klok';

    expect(mapControlsToParams({
      subcategory_link: 'https://api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/straatverlichting-openbare-klok',
      description: 'free text',
      value_0: 0,
      checkbox_false: {
        label: 'Gebeurt het vaker?',
        value: false
      },
      checkbox_true: {
        label: 'Heeft u het gezien?',
        value: true
      },
      object: {
        id: 'foo',
        label: 'Foo'
      },
      array: [{
        id: 'bar',
        label: 'Bar'
      }, {
        id: 'baz',
        label: 'Baz'
      }]
    }, {
      step: {
        form: {
          controls: {
            description: {
              meta: {
                label: 'Omschrijving',
                pathMerge: 'extra_properties',
                isVisible: true
              }
            },
            value_0: {
              meta: {
                label: 'Waarde nul',
                pathMerge: 'extra_properties',
                isVisible: true
              }
            },
            undefined_value: {
              meta: {
                label: 'Waarde undefined',
                pathMerge: 'extra_properties',
                isVisible: true
              }
            },
            checkbox_false: {
              meta: {
                label: 'Checkbox unchecked',
                pathMerge: 'extra_properties',
                isVisible: true
              }
            },
            checkbox_true: {
              meta: {
                label: 'Checkbox checked',
                pathMerge: 'extra_properties',
                isVisible: true
              }
            },
            object: {
              meta: {
                label: 'Selectbox of Radio',
                pathMerge: 'extra_properties',
                isVisible: true
              }
            },
            array: {
              meta: {
                label: 'Multi checkbox',
                pathMerge: 'extra_properties',
                isVisible: true
              }
            },
            var_no_path: {}
          }
        }
      }
    })).toMatchObject({
      extra_properties: [{
        id: 'description',
        label: 'Omschrijving',
        answer: 'free text',
        category_url
      },
      {
        id: 'value_0',
        label: 'Waarde nul',
        answer: 0,
        category_url
      },
      {
        id: 'checkbox_false',
        label: 'Checkbox unchecked',
        answer: {
          label: 'Gebeurt het vaker?',
          value: false
        },
        category_url
      },
      {
        id: 'checkbox_true',
        label: 'Checkbox checked',
        answer: {
          label: 'Heeft u het gezien?',
          value: true
        },
        category_url
      },
      {
        id: 'object',
        label: 'Selectbox of Radio',
        answer: {
          id: 'foo',
          label: 'Foo'
        },
        category_url
      },
      {
        id: 'array',
        label: 'Multi checkbox',
        answer: [{
          id: 'bar',
          label: 'Bar'
        }, {
          id: 'baz',
          label: 'Baz'
        }],
        category_url
      }],
      reporter: {},
      status: {
        state: 'm',
        extra_properties: {}
      }
    });
  });
});
