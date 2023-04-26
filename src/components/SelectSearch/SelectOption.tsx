// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { useCallback, useEffect, useMemo, useRef } from 'react'

import { OptionLi } from './styled'
import type { SelectOptionsProps, SelectProps } from '../Select/Select'

type Props = Omit<SelectOptionsProps, 'options'> & {
  focus: number
  isInputActive: boolean
  option: SelectProps['options'][number]
  onChange: (value: string) => void
  allOptions: SelectProps['options']
  setCurrentFocus: (index: number) => void
  setInputActive: (active: boolean) => void
}

export const SelectOption = ({
  name,
  option,
  optionKey = 'key',
  optionValue = 'value',
  optionName = 'name',
  onChange,
  allOptions,
  setCurrentFocus,
  focus,
  isInputActive,
  setInputActive,
}: Props) => {
  const index = useMemo(
    () => allOptions?.findIndex((o) => o.value === option.value?.toString()),
    [allOptions, option.value]
  )

  const optionRef = useRef<HTMLLIElement>(null)
  useEffect(() => {
    if (focus === index && !isInputActive) {
      optionRef.current?.focus()
    }
  }, [focus, index, isInputActive])

  const onClickHandler = useCallback(() => {
    onChange(option[optionValue]?.toString() as string)
    setCurrentFocus(index)
  }, [onChange, option, optionValue, setCurrentFocus, index])

  const onKeyDownHandler = useCallback(
    (event) => {
      event.preventDefault()
      if (['Enter', 'Space'].includes(event.code)) {
        onChange(option[optionValue]?.toString() as string)
      }
    },
    [onChange, option, optionValue]
  )

  const onKeyUpHandler = useCallback(
    (event) => {
      if (event.code === 'Escape') {
        event.stopPropagation()
        setInputActive(true)
      }
    },
    [setInputActive]
  )

  return (
    <OptionLi
      ref={optionRef}
      role="option"
      key={`${name}-${option[optionKey]}-${index}`}
      value={option[optionValue]?.toString()}
      tabIndex={-1}
      onClick={onClickHandler}
      onKeyDown={onKeyDownHandler}
      onKeyUp={onKeyUpHandler}
    >
      {option[optionName]}
    </OptionLi>
  )
}
