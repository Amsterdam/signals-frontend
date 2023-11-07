// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import type { FC } from 'react'

import { Accordion } from 'components/Accordion'
import CheckboxList from 'components/CheckboxList'
import type { CheckboxListProps } from 'components/CheckboxList'
import type {
  ExtendedCategory,
  StructuredCategories,
} from 'models/categories/selectors'
import type SubCategory from 'types/api/sub-category'

import type { FilterState } from '../reducer'

type CategoryGroupsProps = Partial<CheckboxListProps> & {
  categories: StructuredCategories
  filterSlugs?: Array<ExtendedCategory | SubCategory>
  state: FilterState
}

const getCount = (state: FilterState, key: string, slug: string) => {
  const mainCategory = state.options.maincategory_slug.find(
    (mainCategory) => mainCategory.key === key
  ) as ExtendedCategory & { sub: Array<SubCategory> }

  const mainCategoryCount = mainCategory?.sub?.length ?? ''

  const individualCount = state.options.category_slug.filter(
    (category) => category.category_slug === slug
  ).length

  return mainCategoryCount || individualCount
}

export const CategoryGroups: FC<CategoryGroupsProps> = ({
  categories,
  filterSlugs = [],
  onChange,
  onToggle,
  onSubmit,
  state,
}) => (
  <>
    {Object.entries(categories).map(([slug, { name, sub, key }]) => {
      const defaultValue = filterSlugs?.filter(({ _links: { self }, id }) =>
        new RegExp(`/terms/categories/${slug}`).test(`${self.public || id}`)
      )

      return (
        <Accordion count={getCount(state, key, slug)} id={name} title={name}>
          <CheckboxList
            defaultValue={defaultValue}
            groupId={key}
            groupName="maincategory_slug"
            groupValue={slug}
            hasToggle
            key={slug}
            name={`${slug}_category_slug`}
            onChange={onChange}
            onSubmit={onSubmit}
            onToggle={onToggle}
            options={sub}
          />
        </Accordion>
      )
    })}
  </>
)
