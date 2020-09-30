import { fromJS } from 'immutable';
import {
  makeSelectSubCategories,
  makeSelectCategories,
  makeSelectMainCategories,
  getCategoryData,
} from 'models/categories/selectors';
import { DEFAULT_CLASSIFICATION } from 'shared/services/resolveClassification';

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

export const defaultCategoryData = getCategoryData(subCategories.find(s => s.slug === DEFAULT_CLASSIFICATION));
