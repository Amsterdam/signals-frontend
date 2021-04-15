// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import React from 'react'
import { shallow } from 'enzyme'

import Image from '.'

describe('Preview component <Image />', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<Image />)
  })

  it('should render image correctly', () => {
    wrapper.setProps({
      label: 'Image',
      value: [
        'blob:http://host/c00d2e14-ae1c-4bb3-b67c-86ea93130b1c',
        'blob:http://host/another-unique-key',
      ],
    })

    expect(wrapper).toMatchSnapshot()
  })
})
