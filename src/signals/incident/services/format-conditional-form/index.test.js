// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import checkVisibility from '../checkVisibility'
import formatConditionalForm from '.'

jest.mock('../checkVisibility')

describe('The format conditional form service', () => {
  beforeEach(() => {})

  it('should be undefined by default', () => {
    expect(formatConditionalForm()).toBeUndefined()
  })

  it('should add name and isVisible true when controls are visible', () => {
    checkVisibility.mockImplementation(() => true)

    const controls = {
      description: {
        meta: {
          foo: 'bar',
        },
      },
      title: {
        meta: {
          bar: 'baz',
        },
      },
      var_no_meta: {},
    }
    expect(
      formatConditionalForm({
        controls,
      })
    ).toEqual({
      controls: {
        description: {
          meta: {
            ...controls.description.meta,
            isVisible: true,
            name: 'description',
          },
        },
        title: {
          meta: {
            ...controls.title.meta,
            isVisible: true,
            name: 'title',
          },
        },
        var_no_meta: {},
      },
    })
  })

  it('should add name and isVisible true when controls are not visible', () => {
    checkVisibility.mockImplementation(() => false)

    const controls = {
      description: {
        meta: {
          foo: 'bar',
        },
      },
      title: {
        meta: {
          bar: 'baz',
        },
      },
      var_no_meta: {},
    }
    expect(
      formatConditionalForm({
        controls,
      })
    ).toEqual({
      controls: {
        description: {
          meta: {
            ...controls.description.meta,
            isVisible: false,
            name: 'description',
          },
        },
        title: {
          meta: {
            ...controls.title.meta,
            isVisible: false,
            name: 'title',
          },
        },
        var_no_meta: {},
      },
    })
  })
})
