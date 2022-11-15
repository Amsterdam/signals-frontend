// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2022 Gemeente Amsterdam
import type { FC } from 'react'

import Label from 'components/Label'
import type {
  ExtendedCategory,
  StructuredCategories,
} from 'models/categories/selectors'
import type SubCategory from 'types/api/sub-category'

import CheckboxList from '../../../../../components/CheckboxList'
import type { CheckboxListProps } from '../../../../../components/CheckboxList'

type CategoryGroupsProps = Partial<CheckboxListProps> & {
  categories: StructuredCategories
  filterSlugs?: Array<ExtendedCategory | SubCategory>
}

export const CategoryGroups: FC<CategoryGroupsProps> = ({
  categories,
  filterSlugs,
  onChange,
  onToggle,
  onSubmit,
}) => (
  <>
    {Object.entries(categories).map(([slug, { name, sub, key }]) => {
      const defaultValue = filterSlugs?.filter(({ _links: { self }, id }) =>
        new RegExp(`/terms/categories/${slug}`).test(`${self.public || id}`)
      )

      return (
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
          title={<Label as="span">{name}</Label>}
        />
      )
    })}
  </>
)
CategoryGroups.defaultProps = {
  filterSlugs: [],
}
