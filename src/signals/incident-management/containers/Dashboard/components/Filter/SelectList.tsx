// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import type { Dispatch, SetStateAction } from 'react'
import { useCallback, useEffect, useRef } from 'react'

import { ChevronDown } from '@amsterdam/asc-assets'
import { isNumber } from 'lodash'
import { useFormContext } from 'react-hook-form'

import { filterNames } from './constants'
import OptionsList from './OptionsList'
import {
  InvisibleButton,
  OptionListDropdown,
  RefreshIcon,
  Select,
  SelectContainer,
} from './styled'
import type { Filter } from './types'
import { useFilters } from '../../hooks/useFilter'

type Props = {
  filterActiveName: string
  setFilterActiveName: Dispatch<SetStateAction<string>>
  setQueryString: (queryString: string) => void
}

const SelectList = ({
  filterActiveName,
  setFilterActiveName,
  setQueryString,
}: Props) => {
  const { getValues, reset, setValue, watch } = useFormContext()

  const selectedDepartment = watch('department')

  const filters = useFilters(selectedDepartment)

  useEffect(() => {
    if (!selectedDepartment.value && filters[0].options[0]) {
      setValue('department', filters[0].options[0])
    }

    if (prevSelectTarget.current && !filterActiveName) {
      prevSelectTarget.current?.focus()
    }
  }, [filters, selectedDepartment, setValue, filterActiveName])

  const truncateFilterName = (filterName: string) =>
    filterName.length > 19 ? filterName.substring(0, 19) + '...' : filterName

  const selectRef = useRef<HTMLDivElement>(null)
  const optionsClientRectRef = useRef<{
    left: number
    top: number
  }>()

  const onChangeEvent = useCallback(
    (value, target?: HTMLElement) => {
      filterActiveName === value
        ? setFilterActiveName('')
        : setFilterActiveName(value)

      if (target) {
        prevSelectTarget.current = target
        const selectContainerLeft =
          selectRef.current?.getBoundingClientRect().left || 0
        optionsClientRectRef.current = {
          left: target.getBoundingClientRect().left - selectContainerLeft,
          top: target.getBoundingClientRect().top,
        }
      }
    },
    [filterActiveName, setFilterActiveName]
  )

  const activeFilter = filters.find(
    (filter: Filter) => filter.name === filterActiveName
  )

  const resetWithDefaultValues = () => {
    const defaultValues = Object.fromEntries(
      filterNames.map((name) => [name, { display: '', value: '' }])
    )
    reset(defaultValues)
    setQueryString('')
  }

  const prevSelectTarget = useRef<HTMLElement>()

  return (
    <SelectContainer ref={selectRef}>
      {filters?.map((filter: Filter) => {
        if (filter.name === 'department' && filter.options.length === 1)
          return null

        return (
          <Select
            key={filter.name}
            role="combobox"
            tabIndex={0}
            aria-expanded={!!activeFilter?.name}
            aria-label={truncateFilterName(
              getValues(filter.name)?.display || filter.display
            )}
            onClick={(e) => {
              onChangeEvent(filter.name, e.currentTarget)
            }}
            onKeyDown={(e) => {
              if (['Space', 'ArrowUp', 'ArrowDown'].includes(e.code)) {
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
        role={'button'}
        tabIndex={0}
        onClick={() => {
          onChangeEvent('')
          resetWithDefaultValues()
        }}
        onKeyDown={(e) => {
          if (['Enter', 'Space'].includes(e.code)) {
            onChangeEvent('')
            resetWithDefaultValues()
          }
        }}
      >
        <RefreshIcon width={16} height={18} />
        Wis filters
      </Select>
      <OptionListDropdown
        active={!!activeFilter?.name}
        optionOffsetTop={optionsClientRectRef.current?.top}
      >
        {activeFilter?.name && isNumber(optionsClientRectRef.current?.left) && (
          <OptionsList
            optionsOffsetLeft={optionsClientRectRef.current?.left}
            activeFilter={activeFilter}
            setFilterNameActive={setFilterActiveName}
          />
        )}
      </OptionListDropdown>
    </SelectContainer>
  )
}

export default SelectList
