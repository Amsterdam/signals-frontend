import { fromJS } from 'immutable';
import {
  makeSelectSubCategories,
  makeSelectCategories,
  makeSelectMainCategories,
  makeSelectByMainCategory,
} from 'models/categories/selectors';

import categories from './categories_private.json';

const state = fromJS({
  categories,
});

export const mainCategories = makeSelectMainCategories.resultFunc(
  makeSelectCategories.resultFunc(state)
);

export const subCategories = makeSelectSubCategories.resultFunc(
  makeSelectCategories.resultFunc(state)
);

export const byMain = parentKey =>
  makeSelectByMainCategory.resultFunc(subCategories)(parentKey);
