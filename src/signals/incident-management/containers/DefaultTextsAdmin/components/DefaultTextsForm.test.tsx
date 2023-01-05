// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { withAppContext } from 'test/utils'

import DefaultTextsForm from './DefaultTextsForm'

describe('<DefaultTextsForm />', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('renders the form correctly', () => {
    const props = {
      item: 'item0',
      index: 0,
      value: { text: 'fdsfa', title: 'title', is_active: true },
      nextValue: { text: 'fdsfa', title: 'title', is_active: true },
      onCheck: jest.fn(),
      setValue: jest.fn(),
      itemsLength: 3,
      changeOrdering: jest.fn(),
    }
    render(withAppContext(<DefaultTextsForm {...props} />))

    expect(
      screen.getByTestId(`default-text-form-form-${props.index}`)
    ).toBeInTheDocument()
    expect(screen.getByTestId(`title-${props.index}`)).toBeInTheDocument()
    expect(screen.getByTestId(`text-${props.index}`)).toBeInTheDocument()
    expect(
      screen.getByTestId(`default-text-form-item-button-${props.index}-up`)
    ).toBeDisabled()
    expect(
      screen.getByTestId(`default-text-form-item-button-${props.index}-down`)
    ).not.toBeDisabled()
  })

  it('interacts with the form correctly', () => {
    const props = {
      item: 'item1',
      itemsLength: 3,
      index: 1,
      value: { text: 'fdsfa', title: 'title', is_active: true },
      nextValue: { text: 'fdsfa', title: 'title', is_active: true },
      onCheck: jest.fn(),
      setValue: jest.fn(),
      changeOrdering: jest.fn(),
    }
    render(withAppContext(<DefaultTextsForm {...props} />))

    expect(
      screen.getByTestId(`default-text-form-form-${props.index}`)
    ).toBeInTheDocument()

    const checkbox = screen.getByText('Actief')
    userEvent.click(checkbox)

    expect(screen.getByTestId(`is_active-1`)).toBeChecked()

    userEvent.click(
      screen.getByTestId(`default-text-form-item-button-${props.index}-up`)
    )
    expect(props.changeOrdering).toHaveBeenCalledTimes(1)

    userEvent.click(
      screen.getByTestId(`default-text-form-item-button-${props.index}-down`)
    )
    expect(props.changeOrdering).toHaveBeenCalledTimes(2)
  })

  describe('<checkbox disabled', () => {
    let props = {
      item: 'item0',
      index: 0,
      value: { text: '', title: '', is_active: false },
      nextValue: { text: 'fdsfa', title: 'title', is_active: true },
      onCheck: jest.fn(),
      setValue: jest.fn(),
      itemsLength: 3,
      changeOrdering: jest.fn(),
    }

    it('disables the checkbox correctly', () => {
      const { rerender } = render(
        withAppContext(<DefaultTextsForm {...props} />)
      )

      expect(
        screen.getByTestId(`default-text-form-form-${props.index}`)
      ).toBeInTheDocument()

      expect(screen.getByTestId(`is_active-0`)).toBeDisabled()
      let title0 = screen.getByTestId(`title-0`)
      fireEvent.change(title0, {
        target: { value: 'een titel in het titelveld' },
      })

      rerender(withAppContext(<DefaultTextsForm {...props} />))

      expect(screen.getByTestId(`is_active-0`)).toBeDisabled()
      let text0 = screen.getByTestId(`text-0`)
      title0 = screen.getByTestId(`title-0`)
      fireEvent.change(title0, { target: { value: '' } })
      fireEvent.change(text0, { target: { value: 'tekst in het tekstveld' } })

      rerender(withAppContext(<DefaultTextsForm {...props} />))

      expect(screen.getByTestId(`is_active-0`)).toBeDisabled()
      text0 = screen.getByTestId(`text-0`)
      title0 = screen.getByTestId(`title-0`)
      fireEvent.change(title0, { target: { value: 'titel in het titelveld' } })
      fireEvent.change(text0, { target: { value: 'tekst in het tekstveld' } })

      props = {
        ...props,
        value: { title: 'title', text: 'text', is_active: true },
      }
      rerender(withAppContext(<DefaultTextsForm {...props} />))

      expect(screen.getByTestId(`is_active-0`)).not.toBeDisabled()
    })
  })
})
