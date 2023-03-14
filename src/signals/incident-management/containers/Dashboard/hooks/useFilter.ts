// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { useContext, useEffect, useMemo } from 'react'

import { useSelector } from 'react-redux'

import { makeSelectDepartments } from 'models/departments/selectors'
import IncidentManagementContext from 'signals/incident-management/context'
import type { IncidentManagementContextType } from 'signals/incident-management/context'
import type { ApplicationRootState } from 'types'
import type { Department } from 'types/api/incident'

import { useDepartments } from './useDepartments'
import { punctualityList, stadsdeelList } from '../../../definitions'
import type { Filter, Option } from '../components/Filter/types'

export const useFilters = (selectedDepartment?: Option): Filter[] => {
  const departmentsFromStore = useSelector<
    ApplicationRootState,
    { list: Department[] }
  >(makeSelectDepartments)
  const { departments } = useContext<IncidentManagementContextType>(
    IncidentManagementContext
  )

  const { getDepartmentInformation } = useDepartments()

  useEffect(() => {
    getDepartmentInformation(departmentsFromStore.list)
  }, [departments, departmentsFromStore, getDepartmentInformation])

  const departmentOptions = useMemo(
    () =>
      departments?.map(
        (department): Option => ({
          display: department.name,
          value: department.code,
        })
      ),
    [departments]
  )

  return useMemo(() => {
    const value: string | string[] | null =
      selectedDepartment?.value || (departments && departments[0]?.code)
    const categories = departments
      ?.find((department) => department.code === value)
      ?.categories.map((category) => ({
        value: category.category.slug,
        display: category.category.name,
      }))

    return [
      {
        name: 'department',
        display: 'Afdeling',
        options: departmentOptions || [],
      },
      {
        name: 'category_slug',
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
        name: 'stadsdeel',
        display: 'Stadsdeel',
        options: stadsdeelList.map((item) => ({
          value: item.key,
          display: item.value,
        })),
      },
    ]
  }, [departmentOptions, departments, selectedDepartment?.value])
}
