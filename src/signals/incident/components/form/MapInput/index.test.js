// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { shallow } from 'enzyme'

import MapInput from '.'

describe('Form component <MapInput />', () => {
  const metaFields = {
    name: 'input-field-name',
  }
  let wrapper
  let handler
  let touched
  let getError
  let hasError
  let parent

  beforeEach(() => {
    handler = jest.fn()
    touched = false
    getError = jest.fn()
    hasError = jest.fn()
    parent = {
      meta: {
        updateIncident: jest.fn(),
      },
    }

    handler.mockImplementation(() => ({
      value: {
        geometrie: {
          type: 'Point',
          coordinates: [4, 52],
        },
      },
    }))

    wrapper = shallow(
      <MapInput
        handler={handler}
        parent={parent}
        touched={touched}
        hasError={hasError}
        getError={getError}
      />
    )
  })

  describe('rendering', () => {
    it('should render map field correctly', () => {
      handler.mockImplementation(() => ({ value: {} }))

      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: true,
        },
      })

      expect(handler).toHaveBeenCalledWith()
      expect(wrapper).toMatchSnapshot()
    })

    it('should render no map field when not visible', () => {
      handler.mockImplementation(() => ({ value: undefined }))

      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: false,
        },
      })

      expect(handler).toHaveBeenCalledWith()
      expect(wrapper).toMatchSnapshot()
    })
  })
})
