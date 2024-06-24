// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
// import { Fragment } from 'react'

import { render, act, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import fetch from 'jest-fetch-mock'
import { mocked } from 'jest-mock'

import { getAuthHeaders } from 'shared/services/auth/auth'
import { withAppContext } from 'test/utils'
// import type { RevGeo } from 'types/pdok/revgeo'

import AutoSuggest, { INPUT_DELAY } from '.'
import type { AutoSuggestProps } from '.'
import JSONResponse from './mockResponse.json'

jest.mock('shared/services/auth/auth')
const mockGetAuthHeaders = mocked(getAuthHeaders)
const authHeader = { Authorization: 'Bearer: secret-token' }
mockGetAuthHeaders.mockImplementation(() => authHeader)

const mockResponse = JSON.stringify(JSONResponse)

const numOptionsDeterminer: AutoSuggestProps['numOptionsDeterminer'] = (data) =>
  data?.response?.docs?.length || 0
const formatResponse: AutoSuggestProps['formatResponse'] = (requestData) =>
  requestData?.response?.docs.map((result: any) => {
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

  it('should render a combobox with input field with search-input', () => {
    render(withAppContext(<AutoSuggest {...props} />))

    expect(screen.getByTestId('search-input')).toBeInTheDocument()

    const searchInput = screen.getByTestId('search-input')

    expect(searchInput).toBeInTheDocument()

    userEvent.click(searchInput)

    expect(screen.getByRole('textbox')).toHaveFocus()
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

    userEvent.type(input, 'A')

    act(() => {
      jest.advanceTimersByTime(INPUT_DELAY)
    })

    await screen.findByTestId('auto-suggest')

    expect(fetch).not.toHaveBeenCalled()

    userEvent.type(input, 'm')

    act(() => {
      jest.advanceTimersByTime(INPUT_DELAY)
    })

    await screen.findByTestId('auto-suggest')

    expect(fetch).not.toHaveBeenCalled()

    userEvent.type(input, 's')

    await screen.findByTestId('auto-suggest')

    expect(fetch).not.toHaveBeenCalled()

    act(() => {
      jest.advanceTimersByTime(INPUT_DELAY)
    })

    await screen.findByTestId('auto-suggest')

    const expectedFetchOptions = {
      headers: {
        'Access-Control-Request-Method': 'GET',
        Origin: expect.any(String),
      },
    }

    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledWith(`${url}Ams`, expectedFetchOptions)
  })

  it('should request external service with auth when configured', async () => {
    render(withAppContext(<AutoSuggest {...props} includeAuthHeaders={true} />))
    const input = screen.getByRole('textbox')
    userEvent.type(input, 'Ams')

    act(() => {
      jest.advanceTimersByTime(INPUT_DELAY)
    })

    await screen.findByTestId('auto-suggest')

    const expectedFetchOptions = {
      headers: {
        'Access-Control-Request-Method': 'GET',
        Authorization: 'Bearer: secret-token',
        Origin: expect.any(String),
      },
    }

    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledWith(`${url}Ams`, expectedFetchOptions)
  })

  it('should show a value without sending a request to the external service', async () => {
    const { rerender } = render(withAppContext(<AutoSuggest {...props} />))
    const input = screen.getByRole('textbox') as HTMLInputElement

    await screen.findByTestId('auto-suggest')

    input.focus()

    expect(input.value).toEqual('')

    const value = 'Foo bar bazzzz'

    expect(fetch).not.toHaveBeenCalled()

    rerender(withAppContext(<AutoSuggest {...props} value={value} />))

    await screen.findByTestId('auto-suggest')

    expect(input.value).toEqual(value)

    expect(fetch).not.toHaveBeenCalled()
  })

  // it('should render a list of suggestions', async () => {
  //   render(withAppContext(<AutoSuggest {...props} />))
  //   const input = screen.getByRole('textbox')

  //   expect(screen.queryByTestId('suggest-list')).not.toBeInTheDocument()

  //   userEvent.type(input, 'Amsterdam')

  //   const suggestList = await screen.findByTestId('suggest-list')

  //   expect(suggestList).toBeInTheDocument()
  //   expect(suggestList.getAttribute('role')).toEqual('listbox')
  // })

  // describe('keyboard navigation', () => {
  //   it('ArrowUp key', async () => {
  //     render(withAppContext(<AutoSuggest {...props} />))
  //     const input = screen.getByRole('textbox')

  //     userEvent.type(input, '{ArrowUp}')

  //     await waitFor(() => {
  //       expect(document.activeElement).toEqual(input)
  //     })

  //     userEvent.type(input, 'Diemen')

  //     const suggestList = await screen.findByTestId('suggest-list')
  //     const listItems = [...suggestList.querySelectorAll('li')].reverse()

  //     await waitFor(() => {
  //       formatResponse(JSONResponse as unknown as RevGeo)
  //         .reverse()
  //         .forEach((item, index) => {
  //           userEvent.type(input, '{ArrowUp}')

  //           const activeElement = listItems[index]

  //           expect(input.getAttribute('aria-activedescendant')).toEqual(item.id)
  //           expect(document.activeElement).toEqual(activeElement)
  //         })
  //     })
  //   })

  //   it('ArrowDown key', async () => {
  //     render(withAppContext(<AutoSuggest {...props} />))
  //     const input = screen.getByRole('textbox') as HTMLInputElement

  //     await waitFor(() => {
  //       expect(input.getAttribute('aria-activedescendant')).toBeFalsy()
  //     })

  //     userEvent.type(input, '{ArrowDown}')

  //     expect(document.activeElement).toEqual(input)

  //     userEvent.type(input, 'Weesp')

  //     const suggestList = await screen.findByTestId('suggest-list')

  //     await waitFor(() => {
  //       formatResponse(JSONResponse as unknown as RevGeo).forEach(
  //         (item, index) => {
  //           userEvent.type(input, '{ArrowDown}')

  //           const activeElement = suggestList.querySelector(
  //             `li:nth-of-type(${index + 1}`
  //           )

  //           expect(input.getAttribute('aria-activedescendant')).toEqual(item.id)
  //           expect(document.activeElement).toEqual(activeElement)
  //         }
  //       )
  //     })
  //   })

  //   it('ArrowUp and ArrowDown cycle', async () => {
  //     render(withAppContext(<AutoSuggest {...props} />))
  //     const input = screen.getByRole('textbox')

  //     expect(input.getAttribute('aria-activedescendant')).toBeFalsy()

  //     await waitFor(() => {
  //       userEvent.type(input, 'Weesp')
  //     })

  //     act(() => {
  //       jest.advanceTimersByTime(INPUT_DELAY)
  //     })

  //     const suggestList = await screen.findByTestId('suggest-list')

  //     await waitFor(() => {
  //       userEvent.type(input, '{Down}')
  //     })

  //     const firstElement = suggestList.querySelector('li:nth-of-type(1)')
  //     expect(document.activeElement).toEqual(firstElement)
  //     expect(input.getAttribute('aria-activedescendant')).toEqual(
  //       firstElement?.id
  //     )

  //     await waitFor(() => {
  //       userEvent.type(input, '{Up}')
  //     })

  //     const lastElement = suggestList.querySelector('li:last-of-type')
  //     expect(document.activeElement).toEqual(lastElement)
  //     expect(input.getAttribute('aria-activedescendant')).toEqual(
  //       lastElement?.id
  //     )

  //     await waitFor(() => {
  //       userEvent.type(input, '{ArrowDown}')
  //     })
  //     expect(input.getAttribute('aria-activedescendant')).toEqual(
  //       firstElement?.id
  //     )
  //     expect(document.activeElement).toEqual(firstElement)
  //   })

  //   it('Esc', async () => {
  //     const onClear = jest.fn()
  //     render(withAppContext(<AutoSuggest {...props} onClear={onClear} />))
  //     const input = screen.getByRole('textbox') as HTMLInputElement

  //     await waitFor(() => {
  //       userEvent.type(input, 'Boom')
  //     })

  //     const suggestList = await screen.findByTestId('suggest-list')
  //     const firstElement = suggestList.querySelector('li:nth-of-type(1)')

  //     await waitFor(() => {
  //       userEvent.type(input, '{ArrowDown}')
  //     })

  //     expect(document.activeElement).toEqual(firstElement)
  //     expect(onClear).not.toHaveBeenCalled()

  //     await waitFor(() => {
  //       userEvent.type(input, '{Escape}')
  //     })

  //     expect(onClear).toHaveBeenCalled()
  //     expect(input.value).toEqual('')
  //     expect(document.activeElement).toEqual(input)
  //     expect(screen.queryByTestId('suggest-list')).not.toBeInTheDocument()

  //     await waitFor(() => {
  //       userEvent.type(input, 'sloot')
  //     })

  //     await screen.findByTestId('suggest-list')

  //     await waitFor(() => {
  //       userEvent.type(input, '{Escape}')
  //     })

  //     expect(input.value).toEqual('')
  //     expect(document.activeElement).toEqual(input)
  //     expect(screen.queryByTestId('suggest-list')).not.toBeInTheDocument()
  //   })

  //   it('Esc without onClear defined', async () => {
  //     const { findByTestId, queryByTestId } = render(
  //       withAppContext(<AutoSuggest {...props} />)
  //     )

  //     const input = screen.getByRole('textbox') as HTMLInputElement

  //     await waitFor(() => {
  //       userEvent.type(input, 'Boom')
  //     })

  //     const suggestList = await findByTestId('suggest-list')
  //     const firstElement = suggestList.querySelector('li:nth-of-type(1)')

  //     await waitFor(() => {
  //       userEvent.type(input, '{ArrowDown}')
  //     })

  //     expect(document.activeElement).toEqual(firstElement)

  //     await waitFor(() => {
  //       userEvent.type(input, '{Escape}')
  //     })

  //     expect(input.value).toEqual('')
  //     expect(document.activeElement).toEqual(input)
  //     expect(queryByTestId('suggest-list')).not.toBeInTheDocument()

  //     await waitFor(() => {
  //       userEvent.type(input, 'sloot')
  //     })

  //     await findByTestId('suggest-list')

  //     await waitFor(() => {
  //       userEvent.type(input, '{Esc}')
  //     })

  //     expect(input.value).toEqual('')
  //     expect(document.activeElement).toEqual(input)
  //     expect(queryByTestId('suggest-list')).not.toBeInTheDocument()
  //   })

  //   it('Home', async () => {
  //     render(withAppContext(<AutoSuggest {...props} />))
  //     const input = screen.getByRole('textbox')

  //     await waitFor(() => {
  //       userEvent.type(input, 'Niezel')
  //     })

  //     const suggestList = await screen.findByTestId('suggest-list')

  //     await waitFor(() => {
  //       userEvent.type(input, '{ArrowDown}{ArrowDown}{ArrowDown}')
  //     })

  //     expect(document.activeElement).not.toEqual(input)

  //     await waitFor(() => {
  //       userEvent.type(input, '{Home}')
  //     })

  //     const activeElement = document.activeElement as HTMLInputElement

  //     expect(activeElement).toEqual(input)
  //     expect(activeElement.selectionStart).toEqual(0)
  //     expect(screen.getByTestId('suggest-list')).toBeInTheDocument()

  //     await waitFor(() => {
  //       userEvent.type(input, '{ArrowDown}')
  //     })

  //     const firstElement = suggestList.querySelector('li:nth-of-type(1)')
  //     expect(document.activeElement).toEqual(firstElement)
  //   })

  //   it('End', async () => {
  //     render(withAppContext(<AutoSuggest {...props} />))
  //     const input = screen.getByRole('textbox')
  //     const value = 'Midden'

  //     await waitFor(() => {
  //       userEvent.type(input, `${value}`)
  //     })

  //     const suggestList = await screen.findByTestId('suggest-list')

  //     await waitFor(() => {
  //       userEvent.type(input, '{ArrowDown}{ArrowDown}')
  //     })

  //     expect(document.activeElement).not.toEqual(input)

  //     await waitFor(() => {
  //       userEvent.type(input, '{End}')
  //     })

  //     const activeElement = document.activeElement as HTMLInputElement

  //     expect(activeElement).toEqual(input)
  //     expect(activeElement.selectionStart).toEqual(value.length)
  //     expect(screen.getByTestId('suggest-list')).toBeInTheDocument()

  //     await waitFor(() => {
  //       userEvent.type(input, '{ArrowDown}')
  //     })

  //     const firstElement = suggestList.querySelector('li:nth-of-type(1)')
  //     expect(document.activeElement).toEqual(firstElement)
  //   })

  //   it('Tab', async () => {
  //     const { container } = render(
  //       withAppContext(
  //         <Fragment>
  //           <AutoSuggest {...props} />

  //           <input type="text" name="foo" />
  //         </Fragment>
  //       )
  //     )
  //     const input = container.querySelector(
  //       'input[aria-autocomplete=list]'
  //     ) as HTMLUListElement
  //     const nameField = container.querySelector('input[name=foo]')

  //     await waitFor(() => {
  //       userEvent.type(input, 'Niezel')
  //     })

  //     const suggestList = await screen.findByTestId('suggest-list')

  //     expect(document.activeElement).toEqual(input)

  //     fireEvent.focusOut(input, { relatedTarget: suggestList })

  //     expect(suggestList).toBeInTheDocument()

  //     fireEvent.focusOut(input, { relatedTarget: nameField })

  //     expect(suggestList).not.toBeInTheDocument()
  //   })

  //   it('Enter', async () => {
  //     const mockedOnSubmit = jest.fn()
  //     const { container } = render(
  //       withAppContext(
  //         <form onSubmit={mockedOnSubmit}>
  //           <AutoSuggest {...props} />

  //           <input type="text" name="foo" />
  //         </form>
  //       )
  //     )

  //     const input = container.querySelector(
  //       'input[aria-autocomplete=list]'
  //     ) as HTMLUListElement

  //     await waitFor(() => {
  //       userEvent.type(input, '{Enter}')
  //     })

  //     await screen.findByRole('combobox')
  //     expect(document.activeElement).toEqual(input)

  //     expect(screen.queryByTestId('suggest-list')).not.toBeInTheDocument()
  //     expect(mockedOnSubmit).not.toHaveBeenCalled()
  //   })

  //   it('Any key (yes, such a key exists)', async () => {
  //     render(withAppContext(<AutoSuggest {...props} />))
  //     const input = screen.getByRole('textbox')

  //     await waitFor(() => {
  //       userEvent.type(input, 'Meeuwenlaan')
  //     })

  //     await screen.findByTestId('suggest-list')

  //     await waitFor(() => {
  //       userEvent.type(input, '{ArrowDown}{ArrowDown}')
  //     })

  //     expect(document.activeElement).not.toEqual(input)

  //     await waitFor(() => {
  //       userEvent.type(input, '{Space}')
  //     })

  //     await screen.findByTestId('suggest-list')

  //     expect(document.activeElement).toEqual(input)
  //   })
  // })

  // it('should call onSelect on item click', async () => {
  //   render(withAppContext(<AutoSuggest {...props} />))
  //   const input = screen.getByRole('textbox') as HTMLInputElement

  //   await waitFor(() => {
  //     userEvent.type(input, 'Rembrandt')
  //   })

  //   const suggestList = await screen.findByTestId('suggest-list')

  //   await waitFor(() => {
  //     userEvent.type(input, '{ArrowDown}')
  //   })

  //   expect(document.activeElement).not.toEqual(input)

  //   const firstElement = suggestList.querySelector('li:nth-of-type(1)')
  //   const firstOption = formatResponse(JSONResponse as unknown as RevGeo)[0]

  //   expect(onSelect).not.toHaveBeenCalled()

  //   firstElement && fireEvent.click(firstElement)

  //   expect(document.activeElement).toEqual(input)
  //   expect(screen.queryByTestId('suggest-list')).not.toBeInTheDocument()
  //   expect(input.value).toEqual(firstOption.value)
  //   expect(onSelect).toHaveBeenCalledTimes(1)
  //   expect(onSelect).toHaveBeenCalledWith(firstOption)
  // })

  // it('renders clear button when user types', async () => {
  //   render(withAppContext(<AutoSuggest {...props} />))

  //   expect(screen.queryByTestId('clear-input')).not.toBeInTheDocument()

  //   const input = screen.getByRole('textbox')

  //   await waitFor(() => {
  //     userEvent.type(input, 'Rembrandt')
  //   })

  //   act(() => {
  //     jest.advanceTimersByTime(INPUT_DELAY)
  //   })

  //   await screen.findByTestId('auto-suggest')

  //   expect(screen.getByTestId('clear-input')).toBeInTheDocument()

  //   await waitFor(() => {
  //     userEvent.click(screen.getByTestId('clear-input'))
  //   })

  //   expect(screen.queryByTestId('clear-input')).not.toBeInTheDocument()
  //   expect(input).toBeEmptyDOMElement()
  // })

  // it('calls onClear', async () => {
  //   const onClear = jest.fn()
  //   render(withAppContext(<AutoSuggest {...props} onClear={onClear} />))
  //   const input = screen.getByRole('textbox')

  //   await waitFor(() => {
  //     userEvent.type(input, 'Rembrandt')
  //   })

  //   await screen.findByTestId('auto-suggest')

  //   act(() => {
  //     jest.advanceTimersByTime(INPUT_DELAY)
  //   })

  //   expect(onClear).not.toHaveBeenCalled()

  //   await waitFor(() => {
  //     userEvent.clear(input)
  //   })

  //   await screen.findByTestId('auto-suggest')

  //   act(() => {
  //     jest.advanceTimersByTime(INPUT_DELAY)
  //   })

  //   expect(onClear).toHaveBeenCalled()
  // })

  // it('calls onClear when ClearInput button clicked', async () => {
  //   const onClear = jest.fn()
  //   const value = 'Rembrandt van Rijnweg 2, 1191GG Ouderkerk aan de Amstel'

  //   render(
  //     withAppContext(<AutoSuggest {...props} value={value} onClear={onClear} />)
  //   )

  //   expect(onClear).not.toHaveBeenCalled()

  //   userEvent.click(screen.getByTestId('clear-input'))

  //   expect(onClear).toHaveBeenCalled()

  //   expect(screen.getByRole('textbox')).toHaveFocus()
  // })

  // it('focuses the input on clear', async () => {
  //   const onClear = jest.fn()
  //   const value = 'Rembrandt van Rijnweg 2, 1191GG Ouderkerk aan de Amstel'

  //   render(
  //     withAppContext(
  //       <AutoSuggest
  //         {...props}
  //         value={value}
  //         onClear={onClear}
  //         showInlineList={false}
  //       />
  //     )
  //   )

  //   userEvent.click(screen.getByTestId('clear-input'))

  //   expect(screen.getByRole('textbox')).toHaveFocus()
  // })

  // it('calls onData', async () => {
  //   const onData = jest.fn()

  //   render(withAppContext(<AutoSuggest {...props} onData={onData} />))
  //   const input = screen.getByRole('textbox')

  //   userEvent.type(input, 'Rembrandt')

  //   act(() => {
  //     jest.advanceTimersByTime(INPUT_DELAY)
  //   })

  //   expect(onData).not.toHaveBeenCalled()

  //   await screen.findByTestId('auto-suggest')

  //   expect(onData).toHaveBeenCalled()
  // })

  // it('should work without onClear defined', async () => {
  //   render(withAppContext(<AutoSuggest {...props} />))
  //   const input = screen.getByRole('textbox')

  //   userEvent.type(input, 'Rembrandt')

  //   await screen.findByTestId('auto-suggest')

  //   act(() => {
  //     jest.advanceTimersByTime(INPUT_DELAY)
  //   })

  //   userEvent.clear(input)

  //   await screen.findByTestId('auto-suggest')

  //   act(() => {
  //     jest.advanceTimersByTime(INPUT_DELAY)
  //   })

  //   await screen.findByTestId('auto-suggest')
  // })

  // it('calls onFocus', () => {
  //   const onFocus = jest.fn()

  //   render(withAppContext(<AutoSuggest {...props} onFocus={onFocus} />))

  //   expect(onFocus).not.toHaveBeenCalled()

  //   fireEvent.focus(screen.getByRole('textbox'))

  //   expect(onFocus).toHaveBeenCalled()
  // })

  // it('calls onChange when passed', () => {
  //   const onChange = jest.fn()

  //   render(withAppContext(<AutoSuggest {...props} onChange={onChange} />))

  //   expect(onChange).not.toHaveBeenCalled()

  //   const input = screen.getByRole('textbox')

  //   userEvent.type(input, 'Rembrandt')

  //   expect(onChange).toHaveBeenCalled()
  // })

  // describe('inline button', () => {
  //   it('should render a search input icon', () => {
  //     render(withAppContext(<AutoSuggest {...props} />))

  //     expect(screen.getByTestId('search-input')).toBeInTheDocument()
  //   })

  //   it('should render a clear input', () => {
  //     render(withAppContext(<AutoSuggest {...props} value="Dam" />))

  //     expect(screen.getByTestId('clear-input')).toBeInTheDocument()
  //   })
  // })
})
