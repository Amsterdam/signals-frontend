// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { render, fireEvent, act, screen } from '@testing-library/react'
import { withAppContext } from 'test/utils'

import * as reactRouterDom from 'react-router-dom'
import { mocked } from 'jest-mock'
import KtoForm from '.'

const onSubmit = jest.fn()

const options = [
  { key: 'a', value: 'Foo' },
  { key: 'b', value: 'Bar' },
  { key: 'c', value: 'Baz' },
  { key: 'anders', value: 'Here be dragons' },
]

const mockedUseParams = mocked(reactRouterDom.useParams)
jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
}))

describe('signals/incident/containers/KtoContainer/components/KtoForm', () => {
  beforeEach(() => {
    onSubmit.mockReset()
  })

  it('renders correctly', () => {
    mockedUseParams.mockImplementation(() => ({
      satisfactionIndication: 'nee',
    }))

    const { container, getByTestId, rerender } = render(
      withAppContext(
        <KtoForm isSatisfied onSubmit={onSubmit} options={options} />
      )
    )

    expect(container.querySelectorAll('input[type="radio"]')).toHaveLength(
      options.length
    )

    expect(getByTestId('ktoTextExtra')).toBeInTheDocument()
    expect(getByTestId('ktoAllowsContact')).toBeInTheDocument()
    expect(getByTestId('ktoSubmit')).toBeInTheDocument()

    mockedUseParams.mockImplementation(() => ({ satisfactionIndication: 'ja' }))

    rerender(
      withAppContext(
        <KtoForm isSatisfied onSubmit={onSubmit} options={options} />
      )
    )

    expect(screen.queryByTestId('allowsContact')).toHaveTextContent('ja')
  })

  it('renders the correct title', () => {
    mockedUseParams.mockImplementation(() => ({ satisfactionIndication: 'ja' }))

    const { getByText, unmount, rerender } = render(
      withAppContext(
        <KtoForm isSatisfied onSubmit={onSubmit} options={options} />
      )
    )

    expect(getByText('Waarom bent u tevreden?')).toBeInTheDocument()

    unmount()

    mockedUseParams.mockImplementation(() => ({
      satisfactionIndication: 'nee',
    }))

    rerender(
      withAppContext(
        <KtoForm isSatisfied={false} onSubmit={onSubmit} options={options} />
      )
    )

    expect(screen.queryByText('Waarom bent u ontevreden?')).toBeInTheDocument()
  })

  it('requires one of the options to be selected', () => {
    const { queryByText, getByText, getByTestId } = render(
      withAppContext(
        <KtoForm isSatisfied onSubmit={onSubmit} options={options} />
      )
    )

    expect(queryByText('Dit veld is verplicht')).not.toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()

    act(() => {
      fireEvent.click(getByTestId('ktoSubmit'))
    })

    expect(getByText('Dit veld is verplicht')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('requires text area to contain content when last option is selected', () => {
    const { queryByText, getByText, queryByTestId, getByTestId } = render(
      withAppContext(
        <KtoForm isSatisfied onSubmit={onSubmit} options={options} />
      )
    )

    const lastOption = getByTestId(`kto-${[...options].reverse()[0].key}`)
    expect(queryByTestId('ktoText')).not.toBeInTheDocument()

    act(() => {
      fireEvent.click(lastOption)
    })

    expect(getByTestId('ktoText')).toBeInTheDocument()
    expect(queryByText('Dit veld is verplicht')).not.toBeInTheDocument()

    act(() => {
      fireEvent.click(getByTestId('ktoSubmit'))
    })

    expect(getByText('Dit veld is verplicht')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('should clear error message', () => {
    const { queryByText, getByText, queryByTestId, getByTestId } = render(
      withAppContext(
        <KtoForm isSatisfied onSubmit={onSubmit} options={options} />
      )
    )

    const lastOption = getByTestId(`kto-${[...options].reverse()[0].key}`)
    expect(queryByTestId('ktoText')).not.toBeInTheDocument()

    act(() => {
      fireEvent.click(lastOption)
    })

    act(() => {
      fireEvent.click(getByTestId('ktoSubmit'))
    })

    expect(getByText('Dit veld is verplicht')).toBeInTheDocument()

    const value = 'Qux Baz'

    act(() => {
      fireEvent.change(getByTestId('ktoText'), { target: { value } })
    })

    expect(queryByText('Dit veld is verplicht')).not.toBeInTheDocument()
  })

  it('should handle submit for all but last option', () => {
    const isSatisfied = true
    const { getByTestId } = render(
      withAppContext(
        <KtoForm
          isSatisfied={isSatisfied}
          onSubmit={onSubmit}
          options={options}
        />
      )
    )

    const firstOption = getByTestId(`kto-${options[0].key}`)

    act(() => {
      fireEvent.click(firstOption)
    })

    expect(onSubmit).not.toHaveBeenCalled()

    act(() => {
      fireEvent.click(getByTestId('ktoSubmit'))
    })

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        is_satisfied: isSatisfied,
        text: options[0].value,
      })
    )
  })

  it('should handle submit for last option', () => {
    const { getByTestId } = render(
      withAppContext(
        <KtoForm isSatisfied onSubmit={onSubmit} options={options} />
      )
    )

    const lastOption = getByTestId(`kto-${[...options].reverse()[0].key}`)

    act(() => {
      fireEvent.click(lastOption)
    })

    const value = 'Qux Baz'

    act(() => {
      fireEvent.change(getByTestId('ktoText'), { target: { value } })
    })

    act(() => {
      fireEvent.click(getByTestId('ktoSubmit'))
    })

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        text: value,
      })
    )
  })

  it('should contain the correct values in the submit payload', () => {
    const isSatisfied = false

    const { getByTestId } = render(
      withAppContext(
        <KtoForm
          isSatisfied={isSatisfied}
          onSubmit={onSubmit}
          options={options}
        />
      )
    )

    const secondOption = getByTestId(`kto-${options[1].key}`)

    act(() => {
      fireEvent.click(secondOption)
    })

    const value = 'Bar baz foo'

    act(() => {
      fireEvent.change(getByTestId('ktoTextExtra'), { target: { value } })
    })

    act(() => {
      fireEvent.click(getByTestId('ktoAllowsContact'))
    })

    act(() => {
      fireEvent.click(getByTestId('ktoSubmit'))
    })

    expect(onSubmit).toHaveBeenCalledWith({
      allows_contact: false,
      is_satisfied: isSatisfied,
      text_extra: value,
      text: options[1].value,
    })
  })
})
