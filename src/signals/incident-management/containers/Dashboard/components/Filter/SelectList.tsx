// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import type { Dispatch, SetStateAction } from 'react'
import { useCallback, useEffect } from 'react'

import { ChevronDown } from '@amsterdam/asc-assets'
import { useFormContext } from 'react-hook-form'

import OptionsList from './OptionsList'
import { InvisibleButton, RefreshIcon, SelectLi, SelectUl } from './styled'
import { useFilters } from './useFilter'

type Props = {
  filterActiveName: string
  setFilterActiveName: Dispatch<SetStateAction<string>>
}

const SelectList = ({ filterActiveName, setFilterActiveName }: Props) => {
  const { getValues, reset, setValue, watch } = useFormContext()

  const selectedDepartment = watch('department')

  const filters = useFilters(selectedDepartment)

  // set initial department value
  useEffect(() => {
    if (!selectedDepartment.value && filters[0].options[0]) {
      setValue('department', filters[0].options[0])
    }
  }, [filters, selectedDepartment, setValue])

  const chopFilterName = (filterName: string) =>
    filterName.length > 19 ? filterName.substring(0, 19) + '...' : filterName

  const onChangeEvent = useCallback(
    (value) =>
      filterActiveName === value
        ? setFilterActiveName('')
        : setFilterActiveName(value),
    [filterActiveName, setFilterActiveName]
  )

  const activeFilter = filters.find(
    (filter) => filter.name === filterActiveName
  )

  if (!selectedDepartment.value) {
    return null
  }

  return (
    <SelectUl>
      {filters?.map((filter) => {
        if (filter.name === 'department' && filter.options.length === 1)
          return null

        return (
          <SelectLi
            key={filter.name}
            role="listbox"
            aria-label={chopFilterName(
              getValues(filter.name)?.display || filter.display
            )}
            tabIndex={0}
            onClick={() => {
              onChangeEvent(filter.name)
            }}
            onKeyPress={(e) => {
              if (['Enter', 'Space'].includes(e.code)) {
                onChangeEvent(filter.name)
              }
            }}
            selected={filterActiveName === filter.name}
          >
            {activeFilter?.name === filter.name && (
              <OptionsList
                activeFilter={activeFilter}
                setFilterNameActive={setFilterActiveName}
              />
            )}
            {chopFilterName(getValues(filter.name)?.display || filter.display)}
            <InvisibleButton
              tabIndex={-1}
              selected={filterActiveName === filter.name}
            >
              <ChevronDown width={16} height={16} />
            </InvisibleButton>
          </SelectLi>
        )
      })}
      <SelectLi
        tabIndex={0}
        onClick={() => {
          onChangeEvent('')
          reset()
        }}
        onKeyPress={(e) => {
          if (['Enter', 'Space'].includes(e.code)) {
            onChangeEvent('')
            reset()
          }
        }}
      >
        <RefreshIcon width={16} height={18} />
        Wis filters
      </SelectLi>
    </SelectUl>
  )
}

export default SelectList
