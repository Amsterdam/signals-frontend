// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import type { Dispatch, SetStateAction } from 'react'
import { useCallback, useEffect, useRef } from 'react'

import { ChevronDown } from '@amsterdam/asc-assets'
import { isNumber } from 'lodash'
import { useFormContext } from 'react-hook-form'

import { useFilters } from '../../hooks/useFilter'
import OptionsList from './OptionsList'
import {
  InvisibleButton,
  OptionListDropdown,
  RefreshIcon,
  Select,
  SelectContainer,
} from './styled'
import type { Filter } from './types'

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

  const truncateFilterName = (filterName: string) =>
    filterName.length > 19 ? filterName.substring(0, 19) + '...' : filterName

  const selectContainerRef = useRef<HTMLDivElement>(null)
  const optionsOffsetLeftRef = useRef<number>()

  const onChangeEvent = useCallback(
    (value, target?: HTMLElement) => {
      filterActiveName === value
        ? setFilterActiveName('')
        : setFilterActiveName(value)

      if (target) {
        prevSelectTarget.current = target

        const selectContainerLeft =
          selectContainerRef.current?.getBoundingClientRect().left || 0
        optionsOffsetLeftRef.current =
          target.getBoundingClientRect().left - selectContainerLeft
      }
    },
    [filterActiveName, setFilterActiveName]
  )

  const activeFilter = filters.find(
    (filter: Filter) => filter.name === filterActiveName
  )

  const prevSelectTarget = useRef<HTMLElement>()
  useEffect(() => {
    if (!filterActiveName) {
      prevSelectTarget.current?.focus()
    }
  }, [filterActiveName])

  if (!selectedDepartment.value) {
    return null
  }

  return (
    <SelectContainer ref={selectContainerRef}>
      {filters?.map((filter: Filter) => {
        if (filter.name === 'department' && filter.options.length === 1)
          return null

        return (
          <Select
            key={filter.name}
            role="listbox"
            aria-label={truncateFilterName(
              getValues(filter.name)?.display || filter.display
            )}
            tabIndex={0}
            onClick={(e) => {
              onChangeEvent(filter.name, e.currentTarget)
            }}
            onKeyDown={(e) => {
              if (['Enter', 'Space'].includes(e.code)) {
                e.preventDefault()
                onChangeEvent(filter.name, e.currentTarget)
              }
            }}
            selected={filterActiveName === filter.name}
          >
            {truncateFilterName(
              getValues(filter.name)?.display || filter.display
            )}
            <InvisibleButton
              tabIndex={-1}
              selected={filterActiveName === filter.name}
            >
              <ChevronDown width={16} height={16} />
            </InvisibleButton>
          </Select>
        )
      })}
      <Select
        tabIndex={0}
        role={'button'}
        onClick={() => {
          onChangeEvent('')
          reset()
        }}
        onKeyDown={(e) => {
          if (['Enter', 'Space'].includes(e.code)) {
            onChangeEvent('')
            reset()
          }
        }}
      >
        <RefreshIcon width={16} height={18} />
        Wis filters
      </Select>
      {activeFilter?.name && isNumber(optionsOffsetLeftRef.current) && (
        <OptionListDropdown>
          <OptionsList
            optionsOffsetLeft={optionsOffsetLeftRef.current}
            activeFilter={activeFilter}
            setFilterNameActive={setFilterActiveName}
          />
        </OptionListDropdown>
      )}
    </SelectContainer>
  )
}

export default SelectList
