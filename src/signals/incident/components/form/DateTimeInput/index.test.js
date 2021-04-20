// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import React from 'react'
import { shallow } from 'enzyme'

import DateTimeInput from '.'

describe('Form component <DateTimeInput />', () => {
  const metaFields = {
    name: 'input-field-name',
  }
  let wrapper
  let parent

  const RealDate = Date

  const mockDate = (isoDate) => {
    global.Date = class extends RealDate {
      constructor(...theArgs) {
        if (theArgs.length) {
          return new RealDate(...theArgs)
        }

        return new RealDate(isoDate)
      }

      static now() {
        return new RealDate(isoDate).getTime()
      }
    }
  }

  afterEach(() => {
    global.Date = RealDate
  })

  beforeEach(() => {
    mockDate('2017-02-14')

    parent = {
      meta: {
        updateIncident: jest.fn(),
      },
      value: {
        incident_time_hours: 9,
        incident_time_minutes: 0,
      },
    }

    wrapper = shallow(<DateTimeInput parent={parent} />)
  })

  describe('rendering', () => {
    it('should render date time field correctly', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: true,
        },
      })

      expect(wrapper).toMatchSnapshot()
    })

    it('should render no date time field when not visible', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: false,
        },
      })

      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('events', () => {
    it('sets incident day when value changes', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: true,
        },
      })

      wrapper
        .find('[data-testid="selectDay"]')
        .simulate('change', { target: { value: '2018-07-21' } })

      expect(parent.meta.updateIncident).toHaveBeenCalledWith({
        incident_date: '2018-07-21',
      })
    })

    it('sets incident hour when value changes', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: true,
        },
      })

      wrapper
        .find('[data-testid="selectHours"]')
        .simulate('change', { target: { value: '13' } })

      expect(parent.meta.updateIncident).toHaveBeenCalledWith({
        incident_time_hours: '13',
      })
    })

    it('sets incident minutes when value changes', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: true,
        },
      })

      wrapper
        .find('[data-testid="selectMinutes"]')
        .simulate('change', { target: { value: '42' } })

      expect(parent.meta.updateIncident).toHaveBeenCalledWith({
        incident_time_minutes: '42',
      })
    })
  })
})
