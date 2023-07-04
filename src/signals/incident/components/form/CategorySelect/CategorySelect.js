// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import { useCallback, useState, useEffect } from 'react'

import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import InfoText from 'components/InfoText'
import { SelectSearch } from 'components/SelectSearch'
import { makeSelectSubcategoriesGroupedByCategories } from 'models/categories/selectors'

const StyledInfoText = styled(InfoText)`
  margin-bottom: 0;
`

const CategorySelect = ({ handler, meta, parent }) => {
  const [subcategoryGroups, subcategoryOptions] = useSelector(
    makeSelectSubcategoriesGroupedByCategories
  )

  const [assignedSubcategory, setAssignedSubcategory] = useState()

  const { value } = handler()

  const getSubcategoryBySlug = useCallback(
    (slug) => subcategoryOptions?.find((s) => s.slug === slug) || {},
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
    setAssignedSubcategory(subcategory)
  }, [value, getSubcategoryBySlug])

  const handleChange = useCallback(
    (event) => {
      const item = getSubcategoryValue(event.target.value)

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
          assignedCategory={assignedSubcategory?.name}
          id={meta.name}
          name={meta.name}
          values={subcategoryOptions}
          groups={subcategoryGroups}
          onChange={handleChange}
          autoFocus={false}
          optionValue="key"
        />
      )}
      {assignedSubcategory?.info && (
        <StyledInfoText
          text={`${assignedSubcategory.info}`}
          id={`info-${meta.name}`}
        />
      )}
    </div>
  )
}

CategorySelect.propTypes = {
  handler: PropTypes.func,
  meta: PropTypes.object,
  parent: PropTypes.object,
}

export default CategorySelect
