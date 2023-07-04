// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import { useCallback, useState, useEffect } from 'react'

import { useSelector } from 'react-redux'
import styled from 'styled-components'

import InfoText from 'components/InfoText'
import { SelectSearch } from 'components/SelectSearch'
import { makeSelectSubcategoriesGroupedByCategories } from 'models/categories/selectors'
import type { SubCategoryOption } from 'models/categories/selectors'

const StyledInfoText = styled(InfoText)`
  margin-bottom: 0;
`

type Meta = {
  name: string
  updateIncident: (data: any) => void
}

interface Props {
  handler: () => { value: string }
  meta: Meta
  parent: Record<any, any>
}

const CategorySelect = ({ handler, meta, parent }: Props) => {
  const [subcategoryGroups, subcategoryOptions] = useSelector(
    makeSelectSubcategoriesGroupedByCategories
  )

  const [assignedSubcategory, setAssignedSubcategory] =
    useState<SubCategoryOption>()

  const { value } = handler()

  const getSubcategoryBySlug = useCallback(
    (slug) => subcategoryOptions?.find((s) => s.slug === slug),
    [subcategoryOptions]
  )

  const getSubcategoryValue = useCallback(
    (key) => {
      return subcategoryOptions?.find((v) => v.key === key)
    },
    [subcategoryOptions]
  )

  useEffect(() => {
    const subcategory = getSubcategoryBySlug(value)
    subcategory && setAssignedSubcategory(subcategory)
  }, [value, getSubcategoryBySlug])

  const handleChange = useCallback(
    (event) => {
      const item = getSubcategoryValue(event.target.value)

      if (!item) return

      const { id, slug, category_slug: category, name, handling_message } = item
      parent.meta.updateIncident({
        category,
        subcategory: slug,
        classification: {
          id,
          name,
          slug,
        },
        handling_message,
      })
    },
    [getSubcategoryValue, parent.meta]
  )

  return (
    <div>
      {subcategoryOptions && subcategoryGroups && (
        <SelectSearch
          assignedCategory={assignedSubcategory?.name || ''}
          autoFocus={false}
          groups={subcategoryGroups}
          id={meta.name}
          name={meta.name}
          onChange={handleChange}
          options={subcategoryOptions}
          optionValue="key"
          values={subcategoryOptions}
        />
      )}
      {assignedSubcategory?.description && (
        <StyledInfoText
          text={`${assignedSubcategory.description}`}
          id={`info-${meta.name}`}
        />
      )}
    </div>
  )
}

export default CategorySelect
