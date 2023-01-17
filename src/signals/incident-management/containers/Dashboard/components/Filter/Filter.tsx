// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { useCallback, useEffect, useMemo } from 'react'

import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'

import { makeSelectDepartments } from '../../../../../../models/departments/selectors'
import { generateParams } from '../../../../../../shared/services/api/api'
import type { Department } from '../../../../../../types/api/incident'
import {
  priorityList,
  punctualityList,
  stadsdeelList,
} from '../../../../definitions'

/**
 * make fetchGraphData required when fetching for diagrams
 */
type Props = {
  fetchGraphData?: (queryString: string) => void
}

export const Filter = ({ fetchGraphData = () => {} }: Props) => {
  const { handleSubmit, register, getValues, watch, reset } = useForm()

  const departments = useSelector<unknown, { list: Department[] }>(
    makeSelectDepartments
  )

  const departmentOptions = departments.list.map((department) => ({
    value: department.code,
    display: department.name,
  }))

  const selectedDepartment = watch('department')

  const filters = useMemo(() => {
    const value: string = selectedDepartment || departments?.list[0]?.code

    const categories = Array.isArray(departments.list)
      ? departments.list
          .find((department) => department.code === value)
          ?.category_names.map((category) => ({
            value: category,
            display: category,
          }))
      : null

    return (
      categories && [
        {
          name: 'department',
          options: departmentOptions,
        },
        {
          name: 'category',
          options: categories,
        },
        {
          name: 'priority',
          options: priorityList.map((item) => ({
            value: item.key,
            display: item.value,
          })),
        },
        {
          name: 'punctuality',
          options: punctualityList.map((item) => ({
            value: item.key,
            display: item.value,
          })),
        },
        {
          name: 'district', // stadsdeel
          options: stadsdeelList.map((item) => ({
            value: item.key,
            display: item.value,
          })),
        },
      ]
    )
  }, [departmentOptions, departments.list, selectedDepartment])

  useEffect(() => {
    if (filters) {
      const queryString = generateParams(getValues())
      fetchGraphData(queryString)
    }
  }, [fetchGraphData, filters, getValues])

  const queryFilter = useCallback(
    (value) => {
      if (filters) {
        const queryString = generateParams(value)
        fetchGraphData(queryString)
      }
    },
    [fetchGraphData, filters]
  )

  return (
    <>
      <form onChange={handleSubmit(queryFilter)}>
        {filters?.map((filter) => (
          <select key={filter.name} {...register(filter.name)}>
            {filter.name !== 'department' && (
              <option value={''}>{filter.name}</option>
            )}
            {filter.options?.map((option, index) => (
              <option key={`${option.value}${index}`} value={option.value}>
                {option.display}
              </option>
            ))}
          </select>
        ))}
      </form>
      <button onClick={() => reset()}>Wis filters</button>
    </>
  )
}
