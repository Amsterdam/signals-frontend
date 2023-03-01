// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { useContext, useMemo } from 'react'

import { useLocation } from 'react-router-dom'

import IncidentManagementContext from '../../../context'
import { punctualityList, stadsdeelList } from '../../../definitions'
import { DASHBOARD_URL } from '../../../routes'
import type { Filter, Option } from '../components/Filter/types'

export const useFilters = (selectedDepartment?: Option): Filter[] => {
  const { departmentsWithResponsibleCategories } = useContext(
    IncidentManagementContext
  )

  const location = useLocation()
  const showPeriodFilter = location.pathname === `${DASHBOARD_URL}/vergelijk`

  const departments = departmentsWithResponsibleCategories?.departments

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
    const value: string | undefined =
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
      ...(showPeriodFilter
        ? [
            {
              name: 'period',
              display: 'Periode',
              options: [
                { display: 'Vandaag', value: 'today' },
                { display: 'Deze week', value: 'week' },
                { display: 'Deze maand', value: 'month' },
                { display: 'Dit jaar', value: 'year' },
                { display: 'Selecteer periode', value: 'period' }, // this will become an object with created_before and created_after
                { display: 'Selecteer dagen', value: 'days' }, // this will become an object with two pairs of  created_before and created_after with one day interval
              ],
            },
          ]
        : []),
    ]
  }, [
    departmentOptions,
    departments,
    selectedDepartment?.value,
    showPeriodFilter,
  ])
}
