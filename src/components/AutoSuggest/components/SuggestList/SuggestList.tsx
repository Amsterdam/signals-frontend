// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { useEffect, useRef, useCallback } from 'react'
import styled from 'styled-components'
import { themeColor, themeSpacing, Icon } from '@amsterdam/asc-ui'
import { ChevronRight } from '@amsterdam/asc-assets'

import type { FC } from 'react'
import type { PdokResponse } from 'shared/services/map-location'

const StyledList = styled.ul`
  border: 1px solid ${themeColor('tint', 'level5')};
  border-top: 0;
  padding: 0;
  margin: 0;
`

const Li = styled.li<{ id: string }>`
  line-height: ${themeSpacing(5)};
  padding: ${themeSpacing(2, 5)};
  cursor: pointer;
  display: flex;
  white-space: pre-line;
  cursor: ${({ id }) => (id === 'feedbackEmpty' ? 'default' : 'pointer')};

  &:hover,
  &:focus {
    background-color: ${({ id }) =>
      id !== 'feedbackEmpty' && themeColor('tint', 'level3')};
  }
`

const Chevron = styled(ChevronRight)`
  display: inline-block;
`

const StyledIcon = styled(Icon)`
  margin: 0 ${themeSpacing(2)} 0 0;
  display: inline-block;
`

type SuggestListProps = {
  /** Index (zero-based) of the list item that should get focus */
  activeIndex?: number
  className?: string
  id?: string
  /** Callback function that gets called whenever a list item is clicked or when return is pressed */
  onSelectOption: (option: PdokResponse) => void
  options: Array<PdokResponse>
  /** aria-role for the listbox element */
  role?: string
}

const SuggestList: FC<SuggestListProps> = ({
  activeIndex = 0,
  className = '',
  id,
  onSelectOption,
  options,
  role = 'listbox',
  ...rest
}) => {
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const list = listRef.current

    if (
      (list || activeIndex !== undefined) &&
      activeIndex >= 0 &&
      activeIndex < options.length
    ) {
      ;(list?.children[activeIndex] as HTMLLIElement).focus()
    }
  }, [activeIndex, options.length])

  const onSelect = useCallback(
    (option) => {
      if (option.id !== 'feedbackEmpty') {
        onSelectOption(option)
      }
    },
    [onSelectOption]
  )

  const handleKeyDown = useCallback(
    (event, option) => {
      event.preventDefault()

      // preventing the page from scrolling when cycling through the list of options
      switch (event.key) {
        case 'ArrowUp':
        case 'Up':
        case 'ArrowDown':
        case 'Down':
          break

        case 'Enter':
          onSelect(option)
          break

        default:
          break
      }
    },
    [onSelect]
  )

  /**
   * Give feedback when address cannot be found
   */
  if (options.length === 0) {
    options = [
      {
        id: 'feedbackEmpty',
        value: 'Wij kennen dit adres niet. \n Probeer het opnieuw.',
        data: {
          location: { lat: 0, lng: 0 },
          address: {
            openbare_ruimte: '',
            huisnummer: '',
            postcode: '',
            woonplaats: '',
          },
        },
      },
    ]
  }

  return (
    <StyledList
      className={className}
      data-testid="suggestList"
      id={id}
      role={role}
      ref={listRef}
      {...rest}
    >
      {options.map((option) => (
        <Li
          id={option.id.toString()}
          data-id={option.id}
          key={option.id}
          onClick={() => onSelect(option)}
          onKeyDown={(event) => handleKeyDown(event, option)}
          role="option"
          tabIndex={-1}
        >
          <>
            {option.id !== 'feedbackEmpty' && (
              <StyledIcon className="chrevronIcon" size={12}>
                <Chevron />
              </StyledIcon>
            )}
            {option.value}
          </>
        </Li>
      ))}
    </StyledList>
  )
}

export default SuggestList
