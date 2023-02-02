// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { useEffect, useState } from 'react'

import { useSelector } from 'react-redux'

import useFetch from 'hooks/useFetch'
import { makeSelectDepartments } from 'models/departments/selectors'
import CONFIGURATION from 'shared/services/configuration/configuration'
import type { ApplicationRootState } from 'types'
import type { Department } from 'types/api/incident'

const cachedDepartments: { [key: string]: any } = {}
export const useDepartments = (): {
  departments: Department[]
  isLoading: boolean
} => {
  const [departments, setDepartments] = useState<any>()

  const departmentsFromStore = useSelector<
    ApplicationRootState,
    { list: Department[] }
  >(makeSelectDepartments)

  const { get, data, isLoading } = useFetch()

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
      const responsibleData = data.map((item: any) => {
        return {
          code: item.code,
          display: item.name,
          category_names: item.categories
            .map((category: any) => {
              if (category.is_responsible) {
                return category.category.name
              }
            })
            .filter(Boolean),
        }
      })
      setDepartments({ list: responsibleData })
    }
  }, [data])

  return { departments, isLoading }
}
