import React from 'react';
import { render } from '@testing-library/react';

import { withAppContext } from 'test/utils';
import categories from 'utils/__tests__/fixtures/categories_structured.json';
import CategoryGroups from '../CategoryGroups';

describe('signals/incident-management/components/FilterForm/components/CategoryGroups', () => {
  const mainCatSlug = 'afval';
  const mainCategory = categories[mainCatSlug];
  const subCategories = mainCategory.sub;

  it('should render correctly', () => {
    const filterSlugs = subCategories.concat(mainCategory);

    const { getAllByTestId } = render(
      withAppContext(
        <CategoryGroups
          categories={categories}
          filterSlugs={filterSlugs}
        />
      )
    );

    expect(getAllByTestId('checkboxList')).toHaveLength(Object.keys(categories).length);
  });
});
