// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { useContext, useMemo } from 'react'

import IncidentManagementContext from '../../../context'
import { punctualityList, stadsdeelList } from '../../../definitions'
import type { Filter, Option } from '../components/Filter/types'

export const useFilters = (selectedDepartment?: Option): Filter[] => {
  const { departmentsWithResponsibleCategories } = useContext(
    IncidentManagementContext
  )

  const departments = departmentsWithResponsibleCategories?.departments

  const departmentOptions = useMemo(
    () =>
      departments?.map(
        (department): Option => ({
          display: department.display,
          value: department.value,
        })
      ),
    [departments]
  )

  return useMemo(() => {
    const value: string | undefined =
      selectedDepartment?.value || (departments && departments[0]?.value)

    const categories = departments
      ?.find((department) => department.value === value)
      ?.category_names.map((category: string) => ({
        value: category,
        display: category,
      }))

    return [
      {
        name: 'department',
        display: 'Afdeling',
        options: departmentOptions || [],
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
  }, [departmentOptions, departments, selectedDepartment?.value])
}
