// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { render, fireEvent, act } from '@testing-library/react'
import { withAppContext } from 'test/utils'

import Select from '.'

describe('<Select />', () => {
  let props

  beforeEach(() => {
    props = {
      name: 'select',
      onChange: jest.fn(),
      options: [
        { key: 'all', name: 'Alles', value: '*' },
        { key: 'active', name: 'Actief', value: true },
        { key: 'inactive', name: 'Niet actief', value: false },
      ],
      value: '*',
      label: 'Foo',
    }
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should render correctly', () => {
    const { container } = render(withAppContext(<Select {...props} />))

    const options = container.querySelectorAll('option')
    expect(options).toHaveLength(props.options.length)
    expect(options[0].textContent).toEqual('Alles')
  })

  it('should call onChange prop', () => {
    const onChangeMock = jest.fn()
    const { container } = render(<Select {...props} onChange={onChangeMock} />)

    expect(onChangeMock).not.toHaveBeenCalled()

    act(() => {
      fireEvent.change(container.querySelector('select'), {
        target: { value: 'active' },
      })
    })

    expect(onChangeMock).toHaveBeenCalledTimes(1)
  })
})
