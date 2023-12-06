// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import { useCallback, useEffect, useState, useRef, useMemo } from 'react'

import { Close, Search } from '@amsterdam/asc-assets'
import { useDispatch } from 'react-redux'

import { showGlobalNotification } from 'containers/App/actions'
import { VARIANT_ERROR, TYPE_LOCAL } from 'containers/Notification/constants'
import useDebounce from 'hooks/useDebounce'
import { getErrorMessage } from 'shared/services/api/api'
import { getAuthHeaders } from 'shared/services/auth/auth'
import type { PdokResponse } from 'shared/services/map-location'
import type { RevGeo } from 'types/pdok/revgeo'

import { Wrapper, Input, List, ClearInput } from './styled'

export const INPUT_DELAY = 350

const requestHeaders = {
  Origin: window.location.origin,
  'Access-Control-Request-Method': 'GET',
}

export interface AutoSuggestProps {
  autoFocus?: boolean
  className?: string
  disabled?: boolean
  formatResponse: (data?: any) => Array<any>
  id?: string
  includeAuthHeaders?: boolean
  numOptionsDeterminer: (data: any) => number
  onClear?: () => void
  onData?: (optionsList: any) => void
  onFocus?: () => void
  onSelect: (option: PdokResponse) => void
  placeholder?: string
  showInlineList?: boolean
  tabIndex?: number
  url: string
  showListChanged?: (value: boolean) => void
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
const AutoSuggest = ({
  autoFocus = false,
  className = '',
  disabled = false,
  formatResponse,
  id = '',
  includeAuthHeaders = false,
  numOptionsDeterminer,
  onClear,
  onData,
  onFocus,
  onSelect,
  placeholder = '',
  showInlineList = true,
  url,
  value = '',
  showListChanged,
  ...rest
}: AutoSuggestProps) => {
  const [defaultValue, setDefaultValue] = useState(value)
  const [data, setData] = useState<RevGeo>()
  const [initialRender, setInitialRender] = useState(false)
  const [showList, setShowList] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const options = useMemo(() => data && formatResponse(data), [data])

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>
    if (showListChanged) {
      timeoutId = setTimeout(() => showListChanged(showList), 0)
    }
    return () => clearTimeout(timeoutId)
  }, [showList, showListChanged])

  const activeId = options?.[activeIndex]?.id || ''
  const dispatch = useDispatch()
  const handleInputKeyDown = useCallback((event) => {
    switch (event.key) {
      case 'Enter':
        event.preventDefault()
        break

      default:
        break
    }
  }, [])

  const clearInput = useCallback(
    (event?) => {
      event?.preventDefault()
      if (inputRef.current) {
        inputRef.current.value = ''

        inputRef.current.focus()
      }

      setActiveIndex(-1)
      setShowList(false)
      setDefaultValue('')

      if (onClear) {
        onClear()
      }
    },
    [onClear]
  )

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
          clearInput()
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
    [data, numOptionsDeterminer, showList, clearInput]
  )

  const handleFocusOut = useCallback((event) => {
    if (wrapperRef.current && wrapperRef.current.contains(event.relatedTarget))
      return

    setActiveIndex(-1)
    setShowList(false)
  }, [])

  const serviceRequest = useCallback(
    async (inputValue) => {
      if (inputValue.length >= 3) {
        try {
          const response = await fetch(
            `${url}${encodeURIComponent(inputValue)}`,
            {
              headers: {
                ...requestHeaders,
                ...(includeAuthHeaders ? getAuthHeaders() : {}),
              },
            }
          )

          const responseData = await response.json()

          if (response.ok) {
            setData(responseData)
          }
        } catch (error) {
          dispatch(
            showGlobalNotification({
              title: getErrorMessage(error),
              message: 'De adressen konden niet worden opgehaald.',
              variant: VARIANT_ERROR,
              type: TYPE_LOCAL,
            })
          )
        }
      } else {
        setShowList(false)

        if (inputValue.length === 0 && onClear) {
          onClear()
        }
      }
    },
    [dispatch, includeAuthHeaders, onClear, url]
  )

  const debouncedServiceRequest = useDebounce(serviceRequest, INPUT_DELAY)

  const onChange = useCallback(
    (event) => {
      event.persist()
      setDefaultValue(event.target.value)
      debouncedServiceRequest(event.target.value)
    },
    [debouncedServiceRequest]
  )

  const onSelectOption = useCallback(
    (option) => {
      setActiveIndex(-1)
      setShowList(false)
      setDefaultValue(option.value)

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
    const hasResults = data ? numOptionsDeterminer(data) > 0 : false

    setShowList(hasResults)
  }, [data, numOptionsDeterminer])

  useEffect(() => {
    /* istanbul ignore next */
    if (data?.response?.numFound === 0) {
      setShowList(true)
    }
  }, [data])

  useEffect(() => {
    if (!inputRef.current || value === undefined) return

    inputRef.current.value = value
  }, [value])

  const optionsList = useMemo(
    () =>
      (options && (
        <List
          activeIndex={activeIndex}
          id="as-listbox"
          onSelectOption={onSelectOption}
          options={options}
          role="listbox"
        />
      )) ||
      null,
    [activeIndex, options, onSelectOption]
  )

  useEffect(() => {
    if (onData && options) {
      onData(optionsList)
    }
  }, [options, optionsList, onData])

  return (
    <Wrapper className={className} ref={wrapperRef} data-testid="auto-suggest">
      <div
        aria-controls="as-listbox"
        aria-expanded={showList}
        aria-haspopup="listbox"
        role="combobox"
      >
        <Input
          autoFocus={autoFocus}
          aria-activedescendant={activeId.toString()}
          aria-autocomplete="list"
          autoComplete="off"
          disabled={disabled}
          id={id}
          onChange={onChange}
          onFocus={onFocus}
          placeholder={placeholder}
          ref={inputRef}
          {...rest}
        />
        {defaultValue || value ? (
          <ClearInput
            aria-label="Input verwijderen"
            title="Verwijderen"
            data-testid="clear-input"
            icon={<Close />}
            iconSize={20}
            onClick={clearInput}
            size={24}
            variant="blank"
          />
        ) : (
          <ClearInput
            aria-label="Zoeken"
            title="Zoeken"
            data-testid="search-input"
            icon={<Search />}
            iconSize={20}
            onClick={() => inputRef.current?.focus()}
            size={24}
            variant="blank"
            type="button"
          />
        )}
      </div>
      {showInlineList && showList && optionsList}
    </Wrapper>
  )
}

export default AutoSuggest
