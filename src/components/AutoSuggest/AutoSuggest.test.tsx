// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { Fragment } from 'react'
import { render, fireEvent, act, screen } from '@testing-library/react'
import { withAppContext } from 'test/utils'
import fetch from 'jest-fetch-mock'

import type { RevGeo } from 'types/pdok/revgeo'

import JSONResponse from './mockResponse.json'
import AutoSuggest, { INPUT_DELAY } from '.'

import type { AutoSuggestProps } from '.'

const mockResponse = JSON.stringify(JSONResponse)

const numOptionsDeterminer: AutoSuggestProps['numOptionsDeterminer'] = (data) =>
  data?.response?.docs?.length || 0
const formatResponse: AutoSuggestProps['formatResponse'] = (requestData) =>
  requestData?.response?.docs.map((result) => {
    const { id, weergavenaam } = result
    return {
      id,
      value: weergavenaam,
      data: {
        location: { lat: 0, lng: 0 },
        address: {
          openbare_ruimte: '',
          huisnummer: '',
          postcode: '',
          woonplaats: '',
        },
      },
    }
  }) || []

const onSelect = jest.fn()
const url = '//some-service.com?q='

const props = {
  numOptionsDeterminer,
  formatResponse,
  onSelect,
  url,
}

describe('src/components/AutoSuggest', () => {
  beforeEach(() => {
    fetch.mockResponse(mockResponse)
    onSelect.mockReset()
    jest.useFakeTimers()
  })

  afterEach(() => {
    fetch.resetMocks()
    jest.runOnlyPendingTimers()
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('should render a combobox with input field', () => {
    render(withAppContext(<AutoSuggest {...props} />))

    expect(screen.getByRole('combobox')).toBeInTheDocument()

    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
    expect(input.getAttribute('aria-autocomplete')).toEqual('list')
    expect(input.getAttribute('id')).toBe('')
    expect(input.hasAttribute('disabled')).toBe(false)
  })

  it('should set an id on the input field', () => {
    const id = 'id'
    render(withAppContext(<AutoSuggest {...{ ...props, id }} />))

    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
    expect(input.getAttribute('id')).toEqual(id)
  })

  it('should disable the input field', () => {
    render(withAppContext(<AutoSuggest {...{ ...props, disabled: true }} />))

    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
    expect(input.hasAttribute('disabled')).toBe(true)
  })

  it('should request external service', async () => {
    render(withAppContext(<AutoSuggest {...props} />))
    const input = screen.getByRole('textbox')

    input.focus()

    act(() => {
      fireEvent.change(input, { target: { value: 'A' } })
    })

    act(() => {
      jest.advanceTimersByTime(INPUT_DELAY)
    })

    await screen.findByTestId('autoSuggest')

    expect(fetch).not.toHaveBeenCalled()

    act(() => {
      fireEvent.change(input, { target: { value: 'Am' } })
    })

    act(() => {
      jest.advanceTimersByTime(INPUT_DELAY)
    })

    await screen.findByTestId('autoSuggest')

    expect(fetch).not.toHaveBeenCalled()

    act(() => {
      fireEvent.change(input, { target: { value: 'Ams' } })
    })

    await screen.findByTestId('autoSuggest')

    expect(fetch).not.toHaveBeenCalled()

    act(() => {
      jest.advanceTimersByTime(INPUT_DELAY)
    })

    await screen.findByTestId('autoSuggest')

    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledWith(`${url}Ams`, expect.anything())
  })

  it('should show a value without sending a request to the external service', async () => {
    const { rerender } = render(withAppContext(<AutoSuggest {...props} />))
    const input = screen.getByRole('textbox') as HTMLInputElement

    await screen.findByTestId('autoSuggest')

    input.focus()

    expect(input.value).toEqual('')

    const value = 'Foo bar bazzzz'

    expect(fetch).not.toHaveBeenCalled()

    rerender(withAppContext(<AutoSuggest {...props} value={value} />))

    await screen.findByTestId('autoSuggest')

    expect(input.value).toEqual(value)

    expect(fetch).not.toHaveBeenCalled()
  })

  it('should render a list of suggestions', async () => {
    render(withAppContext(<AutoSuggest {...props} />))
    const input = screen.getByRole('textbox')

    input.focus()

    expect(screen.queryByTestId('suggestList')).not.toBeInTheDocument()

    fireEvent.change(input, { target: { value: 'Amsterdam' } })

    const suggestList = await screen.findByTestId('suggestList')

    expect(suggestList).toBeInTheDocument()
    expect(suggestList.getAttribute('role')).toEqual('listbox')
  })

  describe('keyboard navigation', () => {
    it('ArrowUp key', async () => {
      render(withAppContext(<AutoSuggest {...props} />))
      const input = screen.getByRole('textbox')

      input.focus()

      fireEvent.keyDown(input, { key: 'ArrowUp', code: 38, keyCode: 38 })

      expect(document.activeElement).toEqual(input)

      fireEvent.change(input, { target: { value: 'Diemen' } })

      const suggestList = await screen.findByTestId('suggestList')
      const listItems = [...suggestList.querySelectorAll('li')].reverse()

      formatResponse(JSONResponse as unknown as RevGeo)
        .reverse()
        .forEach((item, index) => {
          fireEvent.keyDown(input, { key: 'ArrowUp', code: 38, keyCode: 38 })

          const activeElement = listItems[index]

          expect(input.getAttribute('aria-activedescendant')).toEqual(item.id)
          expect(document.activeElement).toEqual(activeElement)
        })
    })

    it('ArrowDown key', async () => {
      render(withAppContext(<AutoSuggest {...props} />))
      const input = screen.getByRole('textbox') as HTMLInputElement

      input.focus()

      expect(input.getAttribute('aria-activedescendant')).toBeNull()

      fireEvent.keyDown(input, { key: 'ArrowDown', code: 40, keyCode: 40 })

      expect(document.activeElement).toEqual(input)

      fireEvent.change(input, { target: { value: 'Weesp' } })

      const suggestList = await screen.findByTestId('suggestList')

      formatResponse(JSONResponse as unknown as RevGeo).forEach(
        (item, index) => {
          fireEvent.keyDown(input, { key: 'ArrowDown', code: 40, keyCode: 40 })

          const activeElement = suggestList.querySelector(
            `li:nth-of-type(${index + 1}`
          )

          expect(input.getAttribute('aria-activedescendant')).toEqual(item.id)
          expect(document.activeElement).toEqual(activeElement)
        }
      )
    })

    it('ArrowUp and ArrowDown cycle', async () => {
      render(withAppContext(<AutoSuggest {...props} />))
      const input = screen.getByRole('textbox')

      input.focus()

      expect(input.getAttribute('aria-activedescendant')).toBeNull()

      act(() => {
        fireEvent.change(input, { target: { value: 'Weesp' } })
        jest.advanceTimersByTime(INPUT_DELAY)
      })

      const suggestList = await screen.findByTestId('suggestList')

      act(() => {
        fireEvent.keyDown(input, { key: 'Down', code: 40, keyCode: 40 })
      })

      const firstElement = suggestList.querySelector('li:nth-of-type(1)')
      expect(document.activeElement).toEqual(firstElement)
      expect(input.getAttribute('aria-activedescendant')).toEqual(
        firstElement?.id
      )

      act(() => {
        fireEvent.keyDown(input, { key: 'Up', code: 38, keyCode: 38 })
      })

      const lastElement = suggestList.querySelector('li:last-of-type')
      expect(document.activeElement).toEqual(lastElement)
      expect(input.getAttribute('aria-activedescendant')).toEqual(
        lastElement?.id
      )

      act(() => {
        fireEvent.keyDown(input, { key: 'ArrowDown', code: 40, keyCode: 40 })
      })

      expect(input.getAttribute('aria-activedescendant')).toEqual(
        firstElement?.id
      )
      expect(document.activeElement).toEqual(firstElement)
    })

    it('Esc', async () => {
      const onClear = jest.fn()
      render(withAppContext(<AutoSuggest {...props} onClear={onClear} />))
      const input = screen.getByRole('textbox') as HTMLInputElement

      input.focus()

      fireEvent.change(input, { target: { value: 'Boom' } })

      const suggestList = await screen.findByTestId('suggestList')
      const firstElement = suggestList.querySelector('li:nth-of-type(1)')

      fireEvent.keyDown(input, { key: 'ArrowDown', code: 40, keyCode: 40 })

      expect(document.activeElement).toEqual(firstElement)
      expect(onClear).not.toHaveBeenCalled()

      fireEvent.keyDown(input, { key: 'Escape', code: 13, keyCode: 13 })

      expect(onClear).toHaveBeenCalled()
      expect(input.value).toEqual('')
      expect(document.activeElement).toEqual(input)
      expect(screen.queryByTestId('suggestList')).not.toBeInTheDocument()

      act(() => {
        fireEvent.change(input, { target: { value: 'Boomsloot' } })
      })

      await screen.findByTestId('suggestList')

      act(() => {
        fireEvent.keyDown(input, { key: 'Esc', code: 13, keyCode: 13 })
      })

      expect(input.value).toEqual('')
      expect(document.activeElement).toEqual(input)
      expect(screen.queryByTestId('suggestList')).not.toBeInTheDocument()
    })

    it('Esc without onClear defined', async () => {
      const { findByTestId, queryByTestId } = render(
        withAppContext(<AutoSuggest {...props} />)
      )
      const input = screen.getByRole('textbox') as HTMLInputElement

      input.focus()

      act(() => {
        fireEvent.change(input, { target: { value: 'Boom' } })
      })

      const suggestList = await findByTestId('suggestList')
      const firstElement = suggestList.querySelector('li:nth-of-type(1)')

      act(() => {
        fireEvent.keyDown(input, { key: 'ArrowDown', code: 40, keyCode: 40 })
      })

      expect(document.activeElement).toEqual(firstElement)

      act(() => {
        fireEvent.keyDown(input, { key: 'Escape', code: 13, keyCode: 13 })
      })

      expect(input.value).toEqual('')
      expect(document.activeElement).toEqual(input)
      expect(queryByTestId('suggestList')).not.toBeInTheDocument()

      act(() => {
        fireEvent.change(input, { target: { value: 'Boomsloot' } })
      })

      await findByTestId('suggestList')

      act(() => {
        fireEvent.keyDown(input, { key: 'Esc', code: 13, keyCode: 13 })
      })

      expect(input.value).toEqual('')
      expect(document.activeElement).toEqual(input)
      expect(queryByTestId('suggestList')).not.toBeInTheDocument()
    })

    it('Home', async () => {
      render(withAppContext(<AutoSuggest {...props} />))
      const input = screen.getByRole('textbox')

      input.focus()

      fireEvent.change(input, { target: { value: 'Niezel' } })

      const suggestList = await screen.findByTestId('suggestList')

      fireEvent.keyDown(input, { key: 'ArrowDown', code: 40, keyCode: 40 })
      fireEvent.keyDown(input, { key: 'ArrowDown', code: 40, keyCode: 40 })
      fireEvent.keyDown(input, { key: 'ArrowDown', code: 40, keyCode: 40 })

      expect(document.activeElement).not.toEqual(input)

      fireEvent.keyDown(input, { key: 'Home', code: 36, keyCode: 36 })

      const activeElement = document.activeElement as HTMLInputElement

      expect(activeElement).toEqual(input)
      expect(activeElement.selectionStart).toEqual(0)
      expect(screen.getByTestId('suggestList')).toBeInTheDocument()

      fireEvent.keyDown(input, { key: 'ArrowDown', code: 40, keyCode: 40 })

      const firstElement = suggestList.querySelector('li:nth-of-type(1)')
      expect(document.activeElement).toEqual(firstElement)
    })

    it('End', async () => {
      render(withAppContext(<AutoSuggest {...props} />))
      const input = screen.getByRole('textbox')
      const value = 'Midden'

      input.focus()

      fireEvent.change(input, { target: { value } })

      const suggestList = await screen.findByTestId('suggestList')

      fireEvent.keyDown(input, { key: 'ArrowDown', code: 40, keyCode: 40 })
      fireEvent.keyDown(input, { key: 'ArrowDown', code: 40, keyCode: 40 })

      expect(document.activeElement).not.toEqual(input)

      fireEvent.keyDown(input, { key: 'End', code: 35, keyCode: 35 })

      const activeElement = document.activeElement as HTMLInputElement

      expect(activeElement).toEqual(input)
      expect(activeElement.selectionStart).toEqual(value.length)
      expect(screen.getByTestId('suggestList')).toBeInTheDocument()

      fireEvent.keyDown(input, { key: 'ArrowDown', code: 40, keyCode: 40 })

      const firstElement = suggestList.querySelector('li:nth-of-type(1)')
      expect(document.activeElement).toEqual(firstElement)
    })

    it('Tab', async () => {
      const { container } = render(
        withAppContext(
          <Fragment>
            <AutoSuggest {...props} />

            <input type="text" name="foo" />
          </Fragment>
        )
      )
      const input = container.querySelector(
        'input[aria-autocomplete=list]'
      ) as HTMLUListElement
      const nameField = container.querySelector('input[name=foo]')

      input.focus()

      fireEvent.change(input, { target: { value: 'Niezel' } })

      const suggestList = await screen.findByTestId('suggestList')

      expect(document.activeElement).toEqual(input)

      fireEvent.focusOut(input, { relatedTarget: suggestList })

      expect(suggestList).toBeInTheDocument()

      fireEvent.focusOut(input, { relatedTarget: nameField })

      expect(suggestList).not.toBeInTheDocument()
    })

    it('Enter', async () => {
      const mockedOnSubmit = jest.fn()
      const { container } = render(
        withAppContext(
          <form onSubmit={mockedOnSubmit}>
            <AutoSuggest {...props} />

            <input type="text" name="foo" />
          </form>
        )
      )

      const input = container.querySelector(
        'input[aria-autocomplete=list]'
      ) as HTMLUListElement
      input.focus()

      fireEvent.keyDown(input, { key: 'Enter', code: 13, keyCode: 13 })

      await screen.findByRole('combobox')
      expect(document.activeElement).toEqual(input)

      expect(screen.queryByTestId('suggestList')).not.toBeInTheDocument()
      expect(mockedOnSubmit).not.toHaveBeenCalled()
    })

    it('Any key (yes, such a key exists)', async () => {
      render(withAppContext(<AutoSuggest {...props} />))
      const input = screen.getByRole('textbox')

      input.focus()

      fireEvent.change(input, { target: { value: 'Meeuwenlaan' } })

      await screen.findByTestId('suggestList')

      fireEvent.keyDown(input, { key: 'ArrowDown', code: 40, keyCode: 40 })
      fireEvent.keyDown(input, { key: 'ArrowDown', code: 40, keyCode: 40 })

      expect(document.activeElement).not.toEqual(input)

      fireEvent.keyDown(input, { key: 'Space', code: 91, keyCode: 91 })

      await screen.findByTestId('suggestList')

      expect(document.activeElement).toEqual(input)
    })
  })

  it('should call onSelect on item click', async () => {
    render(withAppContext(<AutoSuggest {...props} />))
    const input = screen.getByRole('textbox') as HTMLInputElement

    fireEvent.change(input, { target: { value: 'Rembrandt' } })

    const suggestList = await screen.findByTestId('suggestList')

    fireEvent.keyDown(input, { key: 'ArrowDown', code: 40, keyCode: 40 })

    expect(document.activeElement).not.toEqual(input)

    const firstElement = suggestList.querySelector('li:nth-of-type(1)')
    const firstOption = formatResponse(JSONResponse as unknown as RevGeo)[0]

    expect(onSelect).not.toHaveBeenCalled()

    firstElement && fireEvent.click(firstElement)

    expect(document.activeElement).toEqual(input)
    expect(screen.queryByTestId('suggestList')).not.toBeInTheDocument()
    expect(input.value).toEqual(firstOption.value)
    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(onSelect).toHaveBeenCalledWith(firstOption)
  })

  it('should call onClear', async () => {
    const onClear = jest.fn()
    render(withAppContext(<AutoSuggest {...props} onClear={onClear} />))
    const input = screen.getByRole('textbox')

    fireEvent.change(input, { target: { value: 'Rembrandt' } })

    await screen.findByTestId('autoSuggest')

    act(() => {
      jest.advanceTimersByTime(INPUT_DELAY)
    })

    expect(onClear).not.toHaveBeenCalled()

    fireEvent.change(input, { target: { value: '' } })

    await screen.findByTestId('autoSuggest')

    act(() => {
      jest.advanceTimersByTime(INPUT_DELAY)
    })

    expect(onClear).toHaveBeenCalled()
  })

  it('should work without onClear defined', async () => {
    render(withAppContext(<AutoSuggest {...props} />))
    const input = screen.getByRole('textbox')

    fireEvent.change(input, { target: { value: 'Rembrandt' } })

    await screen.findByTestId('autoSuggest')

    act(() => {
      jest.advanceTimersByTime(INPUT_DELAY)
    })

    fireEvent.change(input, { target: { value: '' } })

    await screen.findByTestId('autoSuggest')

    act(() => {
      jest.advanceTimersByTime(INPUT_DELAY)
    })

    await screen.findByTestId('autoSuggest')
  })
})
