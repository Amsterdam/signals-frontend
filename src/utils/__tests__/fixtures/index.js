import { fromJS } from 'immutable';

import {
  makeSelectSubCategories,
  makeSelectCategories,
  makeSelectMainCategories,
} from 'models/categories/selectors';

import categoriesFixture from './categories_private.json';

const state = fromJS({
  categories: categoriesFixture,
});

export const mainCategories = makeSelectMainCategories.resultFunc(
  makeSelectCategories.resultFunc(state)
);

export const subCategories = makeSelectSubCategories.resultFunc(
  makeSelectCategories.resultFunc(state)
);

// map subcategories to prevent a warning about non-unique keys rendered by input elements 🙄
export const subcategoriesWithUniqueKeys = subCategories
  .map(subcategory => ({ ...subcategory, value: subcategory.name, key: subcategory._links.self.href }));
