// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { useMemo } from 'react'

import { useSelector } from 'react-redux'

import { makeSelectDepartments } from 'models/departments/selectors'
import type { ApplicationRootState } from 'types'
import type { Department } from 'types/api/incident'

import {
  priorityList,
  punctualityList,
  stadsdeelList,
} from '../../../definitions'
import type { Filter, Option } from '../components/Filter/types'

export const useFilters = (selectedDepartment?: Option): Filter[] => {
  const departments = useSelector<ApplicationRootState, { list: Department[] }>(
    makeSelectDepartments
  )
  const departmentOptions = useMemo(
    () =>
      departments?.list.map((department) => ({
        value: department.code,
        display: department.name,
      })),
    [departments?.list]
  )

  return useMemo(() => {
    const value: string =
      selectedDepartment?.value || departments?.list[0]?.code

    const categories = departments?.list
      .find((department) => department.code === value)
      ?.category_names.map((category: string) => ({
        value: category,
        display: category,
      }))

    return [
      {
        name: 'department',
        display: 'Afdeling',
        options: departmentOptions,
      },
      {
        name: 'category',
        display: 'Categorie',
        options: categories || [],
      },
      {
        name: 'priority',
        display: 'Urgentie',
        options: priorityList.reduce(
          (acc: Option[], item) =>
            item.key !== 'low'
              ? [...acc, { value: item.key, display: item.value }]
              : [...acc],
          []
        ),
      },
      {
        name: 'punctuality',
        display: 'Doorlooptijd',
        options: punctualityList.map((item) => ({
          value: item.key,
          display: item.value,
        })),
      },
      {
        name: 'district',
        display: 'Stadsdeel',
        options: stadsdeelList.map((item) => ({
          value: item.key,
          display: item.value,
        })),
      },
    ]
  }, [departmentOptions, departments.list, selectedDepartment?.value])
}
