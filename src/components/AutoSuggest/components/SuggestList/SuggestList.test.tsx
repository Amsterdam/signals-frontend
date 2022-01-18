// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { createEvent, render, fireEvent } from '@testing-library/react'

import type { PdokResponse } from 'shared/services/map-location'

import { withAppContext } from 'test/utils'

import SuggestList from '.'

const onSelectOption = jest.fn()

const data = {
  address: {
    postcode: '1234 AB',
    huisnummer: '1',
    woonplaats: "A'dam",
    openbare_ruimte: '',
  },
  location: {
    lat: 0,
    lng: 0,
  },
}

const options: Array<PdokResponse> = [
  { id: 1, value: 'Item 1', data },
  { id: 2, value: 'Item 2', data },
  { id: 3, value: 'Item 3', data },
]

describe('src/components/AutoSuggest/components/SuggestList', () => {
  beforeEach(() => {
    onSelectOption.mockReset()
  })

  it('should render a list', () => {
    const { container, queryByTestId, getByText, rerender } = render(
      withAppContext(
        <SuggestList options={[]} onSelectOption={onSelectOption} />
      )
    )

    expect(queryByTestId('suggestList')).toBeNull()

    rerender(
      withAppContext(
        <SuggestList options={options} onSelectOption={onSelectOption} />
      )
    )

    expect(queryByTestId('suggestList')).toBeInTheDocument()
    expect(container.querySelectorAll('li')).toHaveLength(3)
    options.forEach((option) => {
      expect(getByText(option.value)).toBeInTheDocument()
    })
  })

  it('should set focus to one of the list elements', () => {
    const { container, rerender, unmount } = render(
      withAppContext(
        <SuggestList options={options} onSelectOption={onSelectOption} />
      )
    )

    const firstItem = container.querySelector('li:nth-of-type(1)')
    expect(document.activeElement).toEqual(firstItem)

    rerender(
      withAppContext(
        <SuggestList
          options={options}
          onSelectOption={onSelectOption}
          activeIndex={1}
        />
      )
    )

    const secondItem = container.querySelector('li:nth-of-type(2)')
    expect(document.activeElement).toEqual(secondItem)

    unmount()

    rerender(
      withAppContext(
        <SuggestList
          options={options}
          onSelectOption={onSelectOption}
          activeIndex={-1}
        />
      )
    )

    expect(document.activeElement).toEqual(document.body)

    rerender(
      withAppContext(
        <SuggestList
          options={options}
          onSelectOption={onSelectOption}
          activeIndex={10000}
        />
      )
    )

    expect(document.activeElement).toEqual(document.body)
  })

  it('should call onSelectOption', () => {
    const { container, rerender } = render(
      withAppContext(
        <SuggestList options={options} onSelectOption={onSelectOption} />
      )
    )

    const firstItem = container.querySelector('li:nth-of-type(1)')

    expect(onSelectOption).not.toHaveBeenCalled()

    firstItem && fireEvent.click(firstItem)

    expect(onSelectOption).toHaveBeenCalledTimes(1)
    expect(onSelectOption).toHaveBeenCalledWith(options[0])

    rerender(
      withAppContext(
        <SuggestList
          options={options}
          onSelectOption={onSelectOption}
          activeIndex={1}
        />
      )
    )

    const secondItem = container.querySelector('li:nth-of-type(2)')

    secondItem &&
      fireEvent.keyDown(secondItem, { key: 'Enter', code: 13, keyCode: 13 })

    expect(onSelectOption).toHaveBeenCalledTimes(2)
    expect(onSelectOption).toHaveBeenLastCalledWith(options[1])
  })

  it('should NOT call onSelectOption', () => {
    const { container } = render(
      withAppContext(
        <SuggestList
          options={options}
          onSelectOption={onSelectOption}
          activeIndex={2}
        />
      )
    )

    const secondItem = container.querySelector('li:nth-of-type(2)')

    expect(onSelectOption).not.toHaveBeenCalled()

    secondItem &&
      fireEvent.keyDown(secondItem, { key: 'Up', code: 38, keyCode: 38 })

    expect(onSelectOption).not.toHaveBeenCalled()

    secondItem &&
      fireEvent.keyDown(secondItem, { key: 'A', code: 65, keyCode: 65 })

    expect(onSelectOption).not.toHaveBeenCalled()
  })

  it('should prevent event default', () => {
    const { container } = render(
      withAppContext(
        <SuggestList
          options={options}
          onSelectOption={onSelectOption}
          activeIndex={2}
        />
      )
    )

    const thirdItem = container.querySelector('li:nth-of-type(3)')

    if (thirdItem) {
      const enterEvent = createEvent.keyDown(thirdItem, {
        key: 'Enter',
        code: 13,
        keyCode: 13,
      })
      enterEvent.preventDefault = jest.fn()

      expect(enterEvent.preventDefault).not.toHaveBeenCalled()

      fireEvent(thirdItem, enterEvent)

      expect(enterEvent.preventDefault).toHaveBeenCalled()

      const arrowUpEvent = createEvent.keyDown(thirdItem, {
        key: 'ArrowUp',
        code: 38,
        keyCode: 38,
      })
      arrowUpEvent.preventDefault = jest.fn()

      expect(arrowUpEvent.preventDefault).not.toHaveBeenCalled()

      fireEvent(thirdItem, arrowUpEvent)
    }
  })
})
