// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { render } from '@testing-library/react'
import { withAppContext } from 'test/utils'

import TextInput from '..'

describe('<TextInput />', () => {
  it('should render correctly', () => {
    const props = {
      name: 'my_input',
      display: 'display',
      placeholder: 'placeholder',
      handler: jest.fn(),
    }

    const TextInputRender = TextInput(props)
    const { container } = render(withAppContext(<TextInputRender {...props} />))

    expect(
      container.firstChild.querySelector(
        'input[type="text"][id="formmy_input"]'
      )
    ).toBeTruthy()
    expect(
      container.firstChild.querySelector('label[for="formmy_input"]')
    ).toBeTruthy()
  })
})
