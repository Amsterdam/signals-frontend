// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { useEffect, useState } from 'react'

import { useSelector } from 'react-redux'

import { useFetchAll } from 'hooks'
import { makeSelectDepartments } from 'models/departments/selectors'
import CONFIGURATION from 'shared/services/configuration/configuration'
import type { ApplicationRootState } from 'types'
import type { Department } from 'types/api/incident'
import type { DepartmentDetails } from 'types/api/incident'
import type { Category } from 'types/api/incident'

import { sortAlphabetic } from '../../../../../utils/sortAlphabetic'

const cachedDepartments: { [key: string]: any } = {}
export const useDepartments = (): {
  departments?: DepartmentDetails[]
  isLoading: boolean
} => {
  const [departments, setDepartments] = useState<DepartmentDetails[]>()

  const departmentsFromStore = useSelector<
    ApplicationRootState,
    { list: Department[] }
  >(makeSelectDepartments)

  const { get, data, isLoading } = useFetchAll()

  useEffect(() => {
    ;(async () => {
      if (departmentsFromStore) {
        const departmentCodes = departmentsFromStore.list.reduce(
          (code, value) => code + value,
          ''
        )
        if (!cachedDepartments[departmentCodes]) {
          cachedDepartments[departmentCodes] = departmentCodes

          const urls = departmentsFromStore.list.map(
            (department) =>
              `${CONFIGURATION.DEPARTMENTS_ENDPOINT}${department.id}`
          )

          await get(urls)
        }
      }
    })()
  }, [get, departmentsFromStore])

  useEffect(() => {
    if (Array.isArray(data)) {
      const responsibleData = data
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
      setDepartments(responsibleData)
    }
  }, [data])

  return { departments, isLoading }
}
