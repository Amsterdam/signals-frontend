// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import mapPaths from '.'

import getStepControls from '../get-step-controls'
import convertValue from '../convert-value'

jest.mock('../get-step-controls')
jest.mock('../convert-value')

describe('The map paths service', () => {
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
  }

  const incident = {
    description: 'free text',
    value_0: 0,
    category: 'wegen-verkeer-straatmeubilair',
    subcategory: 'straatverlichting-openbare-klok',
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
    array: [
      {
        id: 'bar',
        label: 'Bar',
      },
      {
        id: 'baz',
        label: 'Baz',
      },
    ],
  }

  it('should map status by default', () => {
    expect(mapPaths()).toEqual({})
  })

  it('should map status by default', () => {
    getStepControls.mockImplementation(() => wizard.step.form.controls)
    convertValue
      .mockImplementationOnce(() => incident.description)
      .mockImplementationOnce(() => incident.value_0)
      .mockImplementationOnce(() => undefined)
      .mockImplementationOnce(() => incident.checkbox_false)
      .mockImplementationOnce(() => incident.checkbox_true)
      .mockImplementationOnce(() => incident.object)
      .mockImplementationOnce(() => incident.array)

    expect(mapPaths({}, incident, wizard)).toMatchObject({
      extra_properties: [
        {
          id: 'description',
          label: 'Omschr.',
          answer: 'free text',
          category_url:
            '/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/straatverlichting-openbare-klok',
        },
        {
          id: 'value_0',
          label: '',
          answer: 0,
          category_url:
            '/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/straatverlichting-openbare-klok',
        },
        {
          id: 'checkbox_false',
          label: 'Checkbox unchecked',
          answer: {
            label: 'Gebeurt het vaker?',
            value: false,
          },
          category_url:
            '/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/straatverlichting-openbare-klok',
        },
        {
          id: 'checkbox_true',
          label: 'Checkbox checked',
          answer: {
            label: 'Heeft u het gezien?',
            value: true,
          },
          category_url:
            '/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/straatverlichting-openbare-klok',
        },
        {
          id: 'object',
          label: 'Selectbox of Radio',
          answer: {
            id: 'foo',
            label: 'Foo',
          },
          category_url:
            '/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/straatverlichting-openbare-klok',
        },
        {
          id: 'array',
          label: 'Multi checkbox',
          answer: [
            {
              id: 'bar',
              label: 'Bar',
            },
            {
              id: 'baz',
              label: 'Baz',
            },
          ],
          category_url:
            '/signals/v1/public/terms/categories/wegen-verkeer-straatmeubilair/sub_categories/straatverlichting-openbare-klok',
        },
      ],
    })
  })
})
