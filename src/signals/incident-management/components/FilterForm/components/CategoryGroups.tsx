// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import type { FC } from 'react'
import type SubCategory from 'types/api/sub-category'
import type {
  ExtendedCategory,
  StructuredCategories,
} from 'models/categories/selectors'

import Label from 'components/Label'
import CheckboxList from '../../CheckboxList'

import type { CheckboxListProps } from '../../CheckboxList'

type CategoryGroupsProps = Partial<CheckboxListProps> & {
  categories: StructuredCategories
  filterSlugs?: Array<ExtendedCategory | SubCategory>
}

const CategoryGroups: FC<CategoryGroupsProps> = ({
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

export default CategoryGroups
