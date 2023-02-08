// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import type { Dispatch, SetStateAction } from 'react'
import { useEffect, useRef } from 'react'

import { Controller, useFormContext } from 'react-hook-form'

import { OptionLi } from './styled'
import type { Filter } from './types'
import type { Option as OptionType } from './types'

type Props = {
  activeFilter: Filter
  setFilterNameActive: (name: string) => void
  option: OptionType
  index: number
  focus: number
  setFocus: Dispatch<SetStateAction<number>>
}

export const Option = ({
  activeFilter,
  setFocus,
  setFilterNameActive,
  option,
  index,
  focus,
}: Props) => {
  const { control, getValues } = useFormContext()

  const optionRef = useRef<HTMLLIElement | null>(null)

  useEffect(() => {
    if (focus === index) {
      optionRef.current?.focus()
    }
  }, [focus, index])

  return (
    <Controller
      key={`${option}${index}`}
      name={activeFilter.name}
      control={control}
      render={({ field: { onChange, ref } }) => (
        <OptionLi
          selected={option.value === getValues(activeFilter.name)?.value}
          role="option"
          tabIndex={0}
          ref={(el) => {
            ref(el)
            optionRef.current = el
          }}
          onClick={() => {
            onChange(option)
            setFilterNameActive('')
          }}
          onKeyDown={(e) => {
            e.preventDefault()
            setFocus(index)

            if (['Enter', 'Space'].includes(e.code)) {
              onChange(option)
              setFilterNameActive('')
            } else if (e.code === 'Escape') {
              setFilterNameActive('')
            }
          }}
        >
          {option.display}
        </OptionLi>
      )}
    />
  )
}
