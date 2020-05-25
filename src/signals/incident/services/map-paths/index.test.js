import mapPaths from './index';

import getStepControls from '../get-step-controls';
import convertValue from '../convert-value';

jest.mock('../get-step-controls');
jest.mock('../convert-value');

describe('The map paths service', () => {
  const category_url = '/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/straatverlichting-openbare-klok';
  const wizard = {
    step: {
      form: {
        controls: {
          description: {
            meta: {
              label: 'Omschrijving',
              shortLabel: 'Omschr.',
              pathMerge: 'extra_properties',
              isVisible: true,
            },
          },
          value_0: {
            meta: {
              pathMerge: 'extra_properties',
              isVisible: true,
            },
          },
          undefined_value: {
            meta: {
              label: 'Waarde undefined',
              pathMerge: 'extra_properties',
              isVisible: true,
            },
          },
          checkbox_false: {
            meta: {
              label: 'Checkbox unchecked',
              pathMerge: 'extra_properties',
              isVisible: true,
            },
          },
          checkbox_true: {
            meta: {
              label: 'Checkbox checked',
              pathMerge: 'extra_properties',
              isVisible: true,
            },
          },
          object: {
            meta: {
              label: 'Selectbox of Radio',
              pathMerge: 'extra_properties',
              isVisible: true,
            },
          },
          array: {
            meta: {
              label: 'Multi checkbox',
              pathMerge: 'extra_properties',
              isVisible: true,
            },
          },
          var_no_path: {},
        },
      },
    },
  };

  const incident = {
    subcategory_link: 'https://api.data.amsterdam.nl/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/straatverlichting-openbare-klok',
    description: 'free text',
    value_0: 0,
    checkbox_false: {
      label: 'Gebeurt het vaker?',
      value: false,
    },
    checkbox_true: {
      label: 'Heeft u het gezien?',
      value: true,
    },
    object: {
      id: 'foo',
      label: 'Foo',
    },
    array: [{
      id: 'bar',
      label: 'Bar',
    }, {
      id: 'baz',
      label: 'Baz',
    }],
  };

  it('should map status by default', () => {
    expect(mapPaths()).toEqual({});
  });

  it('should map status by default', () => {
    getStepControls.mockImplementation(() => wizard.step.form.controls);
    convertValue
      .mockImplementationOnce(() => incident.description)
      .mockImplementationOnce(() => incident.value_0)
      .mockImplementationOnce(() => undefined)
      .mockImplementationOnce(() => incident.checkbox_false)
      .mockImplementationOnce(() => incident.checkbox_true)
      .mockImplementationOnce(() => incident.object)
      .mockImplementationOnce(() => incident.array);

    expect(mapPaths({}, incident, wizard)).toMatchObject({
      extra_properties: [{
        id: 'description',
        label: 'Omschr.',
        answer: 'free text',
        category_url,
      },
      {
        id: 'value_0',
        label: '',
        answer: 0,
        category_url,
      },
      {
        id: 'checkbox_false',
        label: 'Checkbox unchecked',
        answer: {
          label: 'Gebeurt het vaker?',
          value: false,
        },
        category_url,
      },
      {
        id: 'checkbox_true',
        label: 'Checkbox checked',
        answer: {
          label: 'Heeft u het gezien?',
          value: true,
        },
        category_url,
      },
      {
        id: 'object',
        label: 'Selectbox of Radio',
        answer: {
          id: 'foo',
          label: 'Foo',
        },
        category_url,
      },
      {
        id: 'array',
        label: 'Multi checkbox',
        answer: [{
          id: 'bar',
          label: 'Bar',
        }, {
          id: 'baz',
          label: 'Baz',
        }],
        category_url,
      }],
    });
  });
});
