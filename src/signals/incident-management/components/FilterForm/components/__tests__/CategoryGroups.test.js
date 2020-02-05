import React from 'react';
import { render } from '@testing-library/react';

import { withAppContext } from 'test/utils';
import categories from 'utils/__tests__/fixtures/categories.json';
import CategoryGroups from '../CategoryGroups';

describe('signals/incident-management/components/FilterForm/components/CategoryGroups', () => {
  const mainCatSlug = 'afval';
  const mainCategory = categories.main.filter(
    ({ slug }) => slug === mainCatSlug
  );
  const subCategories = categories.mainToSub['wegen-verkeer-straatmeubilair'];

  it('should render correctly', () => {
    const filterSlugs = mainCategory.concat(subCategories);
    filterSlugs[0].id = filterSlugs[0].key;
    delete filterSlugs[0].key;

    const { getAllByTestId } = render(
      withAppContext(
        <CategoryGroups
          categories={categories}
          filterSlugs={filterSlugs}
        />
      )
    );

    expect(getAllByTestId('checkboxList')).toHaveLength(categories.main.length);
  });
});
