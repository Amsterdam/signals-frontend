// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import React from 'react'
import { shallow } from 'enzyme'

import CopyFileInput from '.'

describe('<CopyFileInput />', () => {
  let wrapper
  let props

  beforeEach(() => {
    props = {
      name: 'name',
      display: 'display',
      handler: jest.fn(),
      values: [
        { location: 'item0' },
        { location: 'item1' },
        { location: 'item2' },
      ],
    }
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should render correctly', () => {
    const CopyFileInputRender = CopyFileInput(props)
    wrapper = shallow(<CopyFileInputRender {...props} />)

    expect(wrapper).toMatchSnapshot()
  })
})
