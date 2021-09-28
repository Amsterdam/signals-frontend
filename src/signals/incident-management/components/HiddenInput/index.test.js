// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import HiddenInput from '.'

Enzyme.configure({ adapter: new Adapter() })

describe('<HiddenInput />', () => {
  let wrapper
  let props

  beforeEach(() => {
    props = {
      name: 'name',
      handler: jest.fn().mockImplementation(() => ({
        value: 'test waarde',
      })),
    }

    const HiddenInputRender = HiddenInput(props)
    wrapper = shallow(<HiddenInputRender {...props} />)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should render correctly', () => {
    expect(wrapper).not.toBeNull()
    expect(wrapper).toMatchSnapshot()
  })
})
