// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { withAppContext } from 'test/utils'

import { SelectSearch } from './SelectSearch'

const onChangeMock = jest.fn()

describe('<SelectSearch />', () => {
  let props: any

  beforeEach(() => {
    props = {
      id: 'selectTest',
      name: 'select',
      onChange: jest.fn(),
      groups: [
        {
          value: 'vuilnis',
          name: 'vuilnis',
        },
        {
          value: 'politie',
          name: 'politie',
        },
      ],
      options: [
        { key: 'all', name: 'Alles', value: '*', group: 'vuilnis' },
        { key: 'active', name: 'Actief', value: true, group: 'vuilnis' },
        {
          key: 'inactive',
          name: 'Niet actief',
          value: false,
          group: 'politie',
        },
      ],
      value: '*',
      label: 'Foo',
    }

    onChangeMock.mockClear()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should render correctly', async () => {
    render(withAppContext(<SelectSearch {...props} />))

    userEvent.click(screen.getByRole('combobox'))

    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(props.options.length)
    expect(options[0].textContent).toEqual('Alles')
  })

  it('should call onChange prop', () => {
    render(<SelectSearch {...props} onChange={onChangeMock} />)

    expect(onChangeMock).not.toHaveBeenCalled()

    userEvent.click(screen.getByRole('combobox'))

    userEvent.click(screen.getByRole('option', { name: 'Alles' }))

    expect(onChangeMock).toHaveBeenCalledTimes(1)
  })

  it('should change the shown options when typing politie', async () => {
    render(<SelectSearch {...props} onChange={onChangeMock} />)

    expect(onChangeMock).not.toHaveBeenCalled()

    userEvent.click(screen.getByRole('combobox'))

    const clearText = '{selectall}{backspace}niet actief'
    userEvent.type(screen.getByRole('combobox'), clearText)

    expect(screen.getByRole('combobox')).toHaveValue('niet actief')

    userEvent.keyboard('{Enter}')

    userEvent.click(screen.getByRole('combobox'))

    const options = screen.getAllByRole('option')

    expect(options).toHaveLength(1)
    expect(options[0].textContent).toEqual('Niet actief')
  })

  it('should select first option by using the arrow keys', () => {
    render(<SelectSearch {...props} onChange={onChangeMock} />)

    screen.getByRole('combobox').focus()

    userEvent.keyboard('{arrowdown}')

    userEvent.keyboard('{arrowdown}')

    userEvent.keyboard('{Enter}')

    expect(onChangeMock).toHaveBeenCalledWith(
      { target: { value: '*' } },
      { triggerFormChange: true }
    )
  })

  it('should close the combobox when clicking outside', () => {
    render(<SelectSearch {...props} onChange={onChangeMock} />)

    userEvent.click(screen.getByRole('combobox'))

    expect(screen.getByRole('listbox')).toBeInTheDocument()

    userEvent.click(document.body)

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('should focus on the input when pressing the escape key', () => {
    render(<SelectSearch {...props} onChange={onChangeMock} />)

    userEvent.click(screen.getByRole('combobox'))

    expect(screen.getByRole('listbox')).toBeInTheDocument()

    userEvent.keyboard('{arrowdown}')

    expect(screen.getByRole('combobox')).not.toHaveFocus()

    userEvent.keyboard('{esc}')

    expect(screen.getByRole('combobox')).toHaveFocus()
  })

  it('should close the listbox when pressing tab and input is foccused', async () => {
    render(<SelectSearch {...props} onChange={onChangeMock} />)

    userEvent.click(screen.getByRole('combobox'))

    expect(screen.getByRole('listbox')).toBeInTheDocument()

    expect(screen.getByRole('combobox')).toHaveFocus()

    userEvent.tab()

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('should not close the combobox when tabbing through the options', () => {
    render(<SelectSearch {...props} onChange={onChangeMock} />)

    userEvent.click(screen.getByRole('combobox'))

    expect(screen.getByRole('listbox')).toBeInTheDocument()

    userEvent.keyboard('{Space}')

    userEvent.keyboard('{arrowdown}')

    const options = screen.getAllByRole('option')

    expect(options).toHaveLength(props.options.length)

    userEvent.tab()

    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })
})
