// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2022 Gemeente Amsterdam
import { render } from '@testing-library/react'

import { withAppContext } from 'test/utils'
import { mainCategories, subCategories } from 'utils/__tests__/fixtures'
import categories from 'utils/__tests__/fixtures/categories_structured.json'

import { CategoryGroups } from '../CategoryGroups'

describe('signals/incident-management/components/FilterForm/components/CategoryGroups', () => {
  const mainCatSlug = 'afval'
  const mainCategory = mainCategories.filter(({ slug }) => slug === mainCatSlug)
  const subsByMain = subCategories.filter(({ _links }) =>
    _links['sia:parent'].public.endsWith('wegen-verkeer-straatmeubilair')
  )

  it('should render correctly', () => {
    const filterSlugs = subsByMain.concat(mainCategory)
    filterSlugs[0].id = filterSlugs[0].key
    delete filterSlugs[0].key
    delete filterSlugs[1]._links.self.public

    const { getAllByTestId } = render(
      withAppContext(
        <CategoryGroups categories={categories} filterSlugs={filterSlugs} />
      )
    )

    expect(getAllByTestId('checkbox-list')).toHaveLength(
      Object.keys(categories).length
    )
  })
})
