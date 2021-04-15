// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import mapValues from '.'

import getStepControls from '../get-step-controls'
import convertValue from '../convert-value'

jest.mock('../get-step-controls')
jest.mock('../convert-value')

describe('The map values service', () => {
  const wizard = {
    step: {
      form: {
        controls: {
          description: {
            meta: {
              path: 'text',
            },
          },
          title: {
            meta: {
              path: 'meaningOfLife',
            },
          },
          object: {
            meta: {
              path: 'colors',
            },
          },
          undefined_value: {
            meta: {
              path: 'undefined_value',
            },
          },
          value_0: {
            meta: {
              path: 'value_0',
            },
          },
          value_false: {
            meta: {
              path: 'value_false',
            },
          },
          value_true: {
            meta: {
              path: 'value_true',
            },
          },
          var_no_path: {},
        },
      },
    },
  }
  const incident = {
    description: 'bar',
    title: 42,
    object: { id: '42', label: 'yooooo' },
    undefined_value: undefined,
    value_0: 0,
    value_false: false,
    value_true: true,
  }

  it('should map status by default', () => {
    expect(mapValues()).toEqual({})
  })

  it('should map status by default', () => {
    getStepControls.mockImplementation(() => wizard.step.form.controls)
    convertValue
      .mockImplementationOnce(() => incident.description)
      .mockImplementationOnce(() => incident.title)
      .mockImplementationOnce(() => incident.object)
      .mockImplementationOnce(() => incident.undefined_value)
      .mockImplementationOnce(() => incident.value_0)
      .mockImplementationOnce(() => 'nee')
      .mockImplementationOnce(() => 'ja')

    expect(mapValues({}, incident, wizard)).toMatchObject({
      text: 'bar',
      colors: '42',
      meaningOfLife: 42,
      value_0: 0,
      value_false: 'nee',
      value_true: 'ja',
    })
  })
})
