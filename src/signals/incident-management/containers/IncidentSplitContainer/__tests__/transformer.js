import * as modelSelectors from 'models/categories/selectors';

import categoriesFixture from 'utils/__tests__/fixtures/categories_private.json';

// map subcategories to prevent a warning about non-unique keys rendered by the SelectInput element 🙄
export const subcategories = categoriesFixture.results
  .filter(modelSelectors.filterForSub)
  .map(subcategory => ({ ...subcategory, value: subcategory.name, key: subcategory._links.self.href }));
