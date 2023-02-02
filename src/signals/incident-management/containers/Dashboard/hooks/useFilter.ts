// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { useContext, useMemo } from 'react'

import { useSelector } from 'react-redux'

import { makeSelectDepartments } from 'models/departments/selectors'
import type { ApplicationRootState } from 'types'
import type { Department } from 'types/api/incident'

import IncidentManagementContext from '../../../context'
import { punctualityList, stadsdeelList } from '../../../definitions'
import type { Filter, Option } from '../components/Filter/types'

export const useFilters = (selectedDepartment?: Option): Filter[] => {
  const departmentsFromStore = useSelector<
    ApplicationRootState,
    { list: Department[] }
  >(makeSelectDepartments)

  const { departmentsWithResponsibleCategories } = useContext(
    IncidentManagementContext
  )

  const departments = departmentsWithResponsibleCategories?.departments

  const departmentOptions = useMemo(
    () =>
      departmentsFromStore?.list.map((department: Department) => ({
        value: department.code,
        display: department.name,
      })),
    [departmentsFromStore?.list]
  )

  return useMemo(() => {
    const value: string | undefined =
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
        options: [
          {
            display: 'Normale urgentie',
            value: 'normal',
          },
          {
            display: 'Hoge urgentie',
            value: 'high',
          },
        ],
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
  }, [departmentOptions, departments?.list, selectedDepartment?.value])
}
