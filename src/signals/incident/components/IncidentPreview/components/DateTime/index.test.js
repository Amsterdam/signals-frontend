// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { shallow } from 'enzyme'

import DateTime from '.'

describe('Preview component <DateTime />', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<DateTime />)
  })

  it('should render now correctly', () => {
    wrapper.setProps({
      label: 'Datetime',
      value: {
        id: 'Nu',
        label: 'Nu',
      },
    })

    expect(wrapper).toMatchSnapshot()
  })

  it('should render earlier today correctly', () => {
    wrapper.setProps({
      label: 'Datetime',
      value: {
        id: 'Eerder',
        label: 'Eerder',
      },
      incident: {
        incident_date: 'Vandaag',
        incident_time_hours: 13,
        incident_time_minutes: 45,
      },
    })

    expect(wrapper).toMatchSnapshot()
  })

  it('should render earlier date correctly', () => {
    wrapper.setProps({
      label: 'Datetime',
      value: {
        id: 'Eerder',
        label: 'Eerder',
      },
      incident: {
        incident_date: '2018-02-21',
        incident_time_hours: 6,
        incident_time_minutes: 6,
      },
    })

    expect(wrapper).toMatchSnapshot()
  })
})
