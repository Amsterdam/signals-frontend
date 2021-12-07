// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { useCallback, useEffect, useState, useRef } from 'react'
import styled from 'styled-components'

import type { FC } from 'react'
import type { RevGeo } from 'types/pdok/revgeo'
import type { PdokResponse } from 'shared/services/map-location'

import useDebounce from 'hooks/useDebounce'
import useFetch from 'hooks/useFetch'
import Input from 'components/Input'
import SuggestList from './components/SuggestList'

export const INPUT_DELAY = 350

const Wrapper = styled.div`
  position: relative;
`

const StyledInput = styled(Input)`
  outline: 2px solid rgb(0, 0, 0, 0.1);

  & > * {
    margin: 0;
  }
`

const AbsoluteList = styled(SuggestList)`
  position: absolute;
  width: 100%;
  background-color: white;
  z-index: 2;
`

export type Option = {
  id: number | string
  value: string
}

export type AutoSuggestProps = {
  className?: string
  disabled?: boolean
  formatResponse: (data?: RevGeo) => Array<PdokResponse>
  id?: string
  numOptionsDeterminer: (data?: RevGeo) => number
  onClear?: () => void
  onSelect: (option: Option) => void
  placeholder?: string
  url: string
  value?: string
}

/**
 * Autosuggest component that renders a text box and a list with suggestions after text input
 *
 * The text input is delayed by 350ms to prevent flooding of the REST service. Both rendered elements are fully
 * accessibly and have corresponding ARIA 1.1 rules according to spec.
 *
 * Keyboard navigation is handled in the component where (when the list is open):
 * - Tab focuses or blurs the text box, but not the list options
 * - Up and down keys cycle through the list of options, keeping focus on the input field
 * - Escape closes the list, focuses and clears the input field
 * - Home key focuses the input field at the first character
 * - End key focuses the input field at the last character
 */
const AutoSuggest: FC<AutoSuggestProps> = ({
  className,
  formatResponse,
  numOptionsDeterminer,
  onClear,
  onSelect,
  placeholder,
  url,
  value,
  disabled = false,
  id = '',
  ...rest
}) => {
  const { get, data } = useFetch<RevGeo>()
  const [initialRender, setInitialRender] = useState(false)
  const [showList, setShowList] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const options = data && formatResponse(data)
  const activeId = options?.[activeIndex]?.id

  const handleInputKeyDown = useCallback((event) => {
    switch (event.key) {
      case 'Enter':
        event.preventDefault()
        break

      default:
        break
    }
  }, [])

  const handleKeyDown = useCallback(
    (event) => {
      if (!showList) return

      const numberOfOptions = numOptionsDeterminer(data)

      switch (event.key) {
        case 'Up':
        case 'ArrowUp':
          event.preventDefault()

          setActiveIndex((state) => {
            const indexOfActive = state - 1
            const topReached = indexOfActive < 0

            return topReached ? numberOfOptions - 1 : indexOfActive
          })

          break

        case 'Down':
        case 'ArrowDown':
          event.preventDefault()

          setActiveIndex((state) => {
            const indexOfActive = state + 1
            const endReached = indexOfActive === numberOfOptions

            return endReached ? 0 : indexOfActive
          })

          break

        case 'Esc':
        case 'Escape':
          if (inputRef.current) {
            inputRef.current.value = ''
          }

          setActiveIndex(-1)
          setShowList(false)
          if (onClear) onClear()
          break

        case 'Home':
          event.preventDefault()

          if (inputRef.current) {
            inputRef.current.focus()
            inputRef.current.setSelectionRange(0, 0)
          }

          setActiveIndex(-1)
          break

        case 'End':
          event.preventDefault()

          if (inputRef.current) {
            inputRef.current.focus()
            inputRef.current.setSelectionRange(9999, 9999)
          }

          setActiveIndex(-1)
          break

        default:
          setActiveIndex(-1)
          break
      }
    },
    [data, numOptionsDeterminer, showList, onClear]
  )

  const handleFocusOut = useCallback((event) => {
    if (wrapperRef.current && wrapperRef.current.contains(event.relatedTarget))
      return

    setActiveIndex(-1)
    setShowList(false)
  }, [])

  const serviceRequest = useCallback(
    (inputValue) => {
      if (inputValue.length >= 3) {
        get(`${url}${encodeURIComponent(inputValue)}`)
      } else {
        setShowList(false)

        if (inputValue.length === 0 && onClear) {
          onClear()
        }
      }
    },
    [get, onClear, url]
  )

  const debouncedServiceRequest = useDebounce(serviceRequest, INPUT_DELAY)

  const onChange = useCallback(
    (event) => {
      event.persist()
      debouncedServiceRequest(event.target.value)
    },
    [debouncedServiceRequest]
  )

  const onSelectOption = useCallback(
    (option) => {
      setActiveIndex(-1)
      setShowList(false)

      if (inputRef.current) {
        inputRef.current.value = option.value
      }

      onSelect(option)
    },
    [onSelect]
  )

  useEffect(() => {
    setInitialRender(true)
  }, [])

  /**
   * Subscribe to activeIndex changes which happen after keyboard input
   */
  useEffect(() => {
    if (!initialRender || !inputRef.current) return

    if (activeIndex === -1) {
      inputRef.current.focus()
    }
    // only respond to changed in activeIndex; disabling linter
    // eslint-disable-next-line
  }, [activeIndex])

  /**
   * Register and unregister listeners
   */
  useEffect(() => {
    const wrapper = wrapperRef.current
    const input = inputRef.current

    wrapper && wrapper.addEventListener('keydown', handleKeyDown)

    if (input) {
      input.addEventListener('focusout', handleFocusOut)
      input.addEventListener('keydown', handleInputKeyDown)
    }

    return () => {
      wrapper && wrapper.removeEventListener('keydown', handleKeyDown)

      if (input) {
        input.removeEventListener('focusout', handleFocusOut)
        input.removeEventListener('keydown', handleInputKeyDown)
      }
    }
  }, [handleKeyDown, handleFocusOut, handleInputKeyDown])

  /**
   * Subscribe to changes in fetched data
   */
  useEffect(() => {
    const hasResults = numOptionsDeterminer(data) > 0

    setShowList(hasResults)
  }, [data, numOptionsDeterminer])

  useEffect(() => {
    if (!inputRef.current || value === undefined) return

    inputRef.current.value = value
  }, [value])

  return (
    <Wrapper className={className} ref={wrapperRef} data-testid="autoSuggest">
      <div
        aria-controls="as-listbox"
        aria-expanded={showList}
        aria-haspopup="listbox"
        role="combobox"
      >
        <StyledInput
          aria-activedescendant={activeId}
          aria-autocomplete="list"
          autoComplete="off"
          defaultValue={value}
          disabled={disabled}
          id={id}
          onChange={onChange}
          placeholder={placeholder}
          ref={inputRef}
          {...rest}
        />
      </div>
      {options?.length && showList && (
        <AbsoluteList
          activeIndex={activeIndex}
          id="as-listbox"
          onSelectOption={onSelectOption}
          options={options}
          role="listbox"
        />
      )}
    </Wrapper>
  )
}

AutoSuggest.defaultProps = {
  className: '',
  id: '',
  placeholder: '',
  value: '',
}

export default AutoSuggest
