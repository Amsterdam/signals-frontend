// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { useClickOutside } from '@amsterdam/asc-ui'

import { SelectOption } from './SelectOption'
import {
  AbsoluteContentWrapper,
  OptionLiGroup,
  OptionUl,
  SelectIcon,
  SelectSearchWrapper,
  StyledInput,
  StyledInputWrapper,
} from './styled'
import { useRoveFocus } from '../../hooks/useRoveFocus'
import type { SelectProps } from '../Select/Select'

interface Props extends SelectProps {
  assignedCategory: string
  autoFocus?: boolean
  onChange: (
    e: React.FormEvent<HTMLSelectElement>,
    options?: { triggerFormChange: boolean }
  ) => void
  values: SelectProps['options']
}

export const SelectSearch = ({
  assignedCategory = '',
  autoFocus = true,
  groups,
  id,
  name,
  onChange,
  optionKey = 'key',
  optionName = 'name',
  optionValue = 'value',
  values,
}: Props) => {
  const options: SelectProps['options'] = values.map(
    ({ key, value, group }) => ({
      key: key || '',
      name: value,
      value: key || '',
      group,
    })
  )

  const [isOpen, setIsOpen] = useState(false)

  const getOptionValueName = useCallback(
    (val: string) => {
      return options?.find((option) => option[optionValue] === val)?.name ?? ''
    },
    [options, optionValue]
  )

  const [inputValue, setInputValue] = useState('')
  const [isInputActive, setIsInputActive] = useState(false)
  const [filteredOptions, setFilteredOptions] = useState(options)
  const [filteredGroups, setFilteredGroups] = useState(groups)
  const { currentFocus, setCurrentFocus } = useRoveFocus(filteredOptions.length)

  const optionsOrderedByGroup = useMemo(() => {
    return filteredGroups?.flatMap((group) =>
      filteredOptions.filter((option) => option.group === group.value)
    )
  }, [filteredGroups, filteredOptions])

  const inputRef = useRef<HTMLInputElement>(null)
  const optionUlRef = useRef<HTMLUListElement>(null)
  const selectSearchWrapperRef = useRef<HTMLDivElement>(null)

  useClickOutside(selectSearchWrapperRef, () => {
    setIsOpen(false)
    setCurrentFocus(0)
  })

  const onChangeInputHandler = useCallback(
    (e) => {
      setInputValue(e.target.value)

      const filteredOptions = options?.filter((option) =>
        option?.name?.toLowerCase().includes(e.target.value.toLowerCase())
      )

      const filteredGroups = groups?.filter((group) =>
        filteredOptions.some(
          (option) => option.group?.toLowerCase() === group.value.toLowerCase()
        )
      )

      setFilteredGroups(filteredGroups)
      setFilteredOptions(filteredOptions)
    },
    [groups, options]
  )

  const openOptions = useCallback((event, selectOnOpen = true) => {
    setIsOpen(true)
    setIsInputActive(true)
    /*
        The following lines are needed to make the input value selectable.
       */
    if (selectOnOpen) {
      /* istanbul ignore next */
      setTimeout(() => {
        event.target.select()
      }, 0)
    }
  }, [])

  const onKeydownInputHandler = useCallback(
    (event) => {
      if (event.code === 'Enter' && isOpen) {
        event.preventDefault()
        // Select first option as default
        const { value, name } = filteredOptions[0]

        /* istanbul ignore next */
        if (!value || !name) return

        onChange({ target: { value: value } } as any, {
          triggerFormChange: true,
        })

        setInputValue(name)
        setIsOpen(false)
        inputRef?.current?.focus()
      }

      if ((event.code === 'ArrowDown' || event.code === 'Space') && !isOpen) {
        event.preventDefault()
        openOptions(event)
      }

      if (event.key.match(/^[a-z0-9]$/i) && !isOpen) {
        event.preventDefault()
        openOptions(event, false)
        setInputValue(event.key)
      }

      if (event.code === 'ArrowDown' && isOpen) {
        event.stopPropagation()
        setCurrentFocus(0)
        setIsInputActive(false)
      }

      if (event.code === 'Tab' || event.key === 'Tab') {
        setIsOpen(false)
      }
    },
    [isOpen, onChange, filteredOptions, openOptions, setCurrentFocus]
  )

  useEffect(() => {
    assignedCategory && setInputValue(assignedCategory)
  }, [assignedCategory])

  useEffect(() => {
    !filteredGroups?.length && setFilteredGroups(groups)
  }, [filteredGroups, groups])

  useEffect(() => {
    !filteredOptions?.length && setFilteredOptions(values)
  }, [filteredOptions, values])

  useEffect(() => {
    if (isInputActive) {
      inputRef.current?.focus()
    }
  }, [isInputActive])

  return (
    <SelectSearchWrapper ref={selectSearchWrapperRef}>
      <StyledInputWrapper>
        <StyledInput
          ref={inputRef}
          autoComplete="off"
          autoFocus={autoFocus}
          onChange={onChangeInputHandler}
          onKeyDown={onKeydownInputHandler}
          onClick={(event) => {
            openOptions(event)
          }}
          type="text"
          value={inputValue}
          id="combobox"
          role="combobox"
          placeholder="Zoek op subcategorie"
        />
        <AbsoluteContentWrapper>
          {!isOpen && <SelectIcon />}
        </AbsoluteContentWrapper>
      </StyledInputWrapper>
      {isOpen && (
        <OptionUl ref={optionUlRef} role="listbox" data-testid={name} id={id}>
          {filteredGroups?.length === 0 && (
            <OptionLiGroup key="empty" role="group" aria-label="empty">
              {'Geen opties beschikbaar'}
            </OptionLiGroup>
          )}
          {filteredGroups &&
            optionsOrderedByGroup &&
            filteredGroups.map((group) => (
              <Fragment key={group.name}>
                <OptionLiGroup
                  key={`${group.name}`}
                  role="group"
                  aria-label={group.name}
                >
                  {group.name}
                </OptionLiGroup>
                {filteredOptions
                  .filter((option) => option.group === group.value)
                  .map((option, index) => (
                    <SelectOption
                      isInputActive={isInputActive}
                      key={index}
                      option={option}
                      setCurrentFocus={setCurrentFocus}
                      focus={currentFocus}
                      name={name}
                      setInputActive={setIsInputActive}
                      allOptions={optionsOrderedByGroup}
                      onChange={(value) => {
                        onChange({ target: { value } } as any, {
                          triggerFormChange: true,
                        })
                        setInputValue(getOptionValueName(value))
                        setIsOpen(false)
                        inputRef?.current?.focus()
                      }}
                      optionKey={optionKey}
                      optionValue={optionValue}
                      optionName={optionName}
                    />
                  ))}
              </Fragment>
            ))}
        </OptionUl>
      )}
    </SelectSearchWrapper>
  )
}
