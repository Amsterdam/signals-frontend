// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2022 Gemeente Amsterdam
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@zarconontol/enzyme-adapter-react-18'

import TextAreaInput from '.'

Enzyme.configure({ adapter: new Adapter() })

describe('<TextAreaInput />', () => {
  let wrapper
  let props

  beforeEach(() => {
    props = {
      name: 'name',
      display: 'display',
      placeholder: 'placeholder',
      handler: jest.fn(),
      rows: 2,
    }

    wrapper = shallow(<TextAreaInput {...props} />)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should render correctly', () => {
    wrapper = shallow(<TextAreaInput {...props} />)

    expect(wrapper).toMatchSnapshot()
  })

  it('should render character counter correctly', () => {
    props.maxLength = 300
    wrapper = shallow(<TextAreaInput {...props} />)

    expect(wrapper).toMatchSnapshot()
  })

  it('should render character counter with value correctly', () => {
    props.maxLength = 300
    props.value = 'test'
    wrapper = shallow(<TextAreaInput {...props} />)

    expect(wrapper).toMatchSnapshot()
  })
})
