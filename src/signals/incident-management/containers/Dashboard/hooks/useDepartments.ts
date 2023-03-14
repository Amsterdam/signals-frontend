// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { useContext, useCallback, useEffect } from 'react'

import { useFetchAll } from 'hooks'
import CONFIGURATION from 'shared/services/configuration/configuration'
import IncidentManagementContext from 'signals/incident-management/context'
import type { IncidentManagementContextType } from 'signals/incident-management/context'
import type {
  Category,
  Department,
  DepartmentDetails,
} from 'types/api/incident'

import { sortAlphabetic } from '../../../../../utils/sortAlphabetic'

const cachedDepartments: { [key: string]: any } = {}

export const useDepartments = (): {
  departments: DepartmentDetails[] | null
  getDepartmentInformation: (departmentsFromStore: Department[]) => void
  isLoading: boolean
} => {
  const { departments, setDepartments } =
    useContext<IncidentManagementContextType>(IncidentManagementContext)

  const { data, get, isLoading } = useFetchAll<DepartmentDetails>()

  const getDepartmentInformation = useCallback(
    async (departmentsFromStore: Department[]) => {
      if (departments && departments.length > 0) return

      if (departmentsFromStore) {
        const departmentCodes = departmentsFromStore.reduce(
          (code, value) => code + value,
          ''
        )
        if (!cachedDepartments[departmentCodes]) {
          cachedDepartments[departmentCodes] = departmentCodes

          const urls = departmentsFromStore.map(
            (department) =>
              `${CONFIGURATION.DEPARTMENTS_ENDPOINT}${department.id}`
          )

          await get(urls)
        }
      }
    },
    [departments, get]
  )

  useEffect(() => {
    if (data) {
      const filteredDepartments = data
        .map((item) => {
          return {
            ...item,
            categories: item.categories
              .filter((category: Category) => category.is_responsible)
              .sort((a: Category, b: Category) =>
                sortAlphabetic(a.category.slug, b.category.slug)
              ),
          }
        })
        .filter((item) => item.categories.length > 0)

      setDepartments(filteredDepartments)
    }
  }, [data, setDepartments])

  return { departments, getDepartmentInformation, isLoading }
}
