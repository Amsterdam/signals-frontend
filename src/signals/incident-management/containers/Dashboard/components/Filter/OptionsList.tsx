// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import type { Dispatch, SetStateAction } from 'react'

import { Controller, useFormContext } from 'react-hook-form'

import { OptionUl, OptionLi } from './styled'
import type { Filter } from './types'

type Props = {
  setFilterNameActive: Dispatch<SetStateAction<string>>
  activeFilter: Filter
  left: number
}

const OptionsList = ({ setFilterNameActive, activeFilter, left }: Props) => {
  const { control, getValues } = useFormContext()

  return (
    <>
      <OptionUl left={left}>
        {activeFilter.options.map((option, index) => (
          <Controller
            key={`${option}${index}`}
            name={activeFilter.name}
            control={control}
            render={({ field: { onChange, ref } }) => (
              <OptionLi
                selected={option.value === getValues(activeFilter.name)?.value}
                role="option"
                tabIndex={0}
                ref={ref}
                onClick={() => {
                  onChange(option)
                  setFilterNameActive('')
                }}
                onKeyDown={(e) => {
                  if (['Enter', 'Space'].includes(e.key)) {
                    onChange(option)
                    setFilterNameActive('')
                  }
                }}
              >
                {option.display}
              </OptionLi>
            )}
          />
        ))}
      </OptionUl>
    </>
  )
}

export default OptionsList
