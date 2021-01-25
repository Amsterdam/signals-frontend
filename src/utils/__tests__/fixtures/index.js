import { fromJS } from 'immutable';

import {
  makeSelectSubCategories,
  makeSelectCategories,
  makeSelectMainCategories,
  makeSelectSubcategoriesGroupedByCategories,
  makeSelectHandlingTimesBySlug,
} from 'models/categories/selectors';
import { makeSelectDepartments, makeSelectDirectingDepartments } from 'models/departments/selectors';

import categoriesFixture from './categories_private.json';
import departmentsFixture from './departments.json';


const state = fromJS({
  categories: categoriesFixture,
});

export const mainCategories = makeSelectMainCategories.resultFunc(makeSelectCategories.resultFunc(state));

export const subCategories = makeSelectSubCategories.resultFunc(makeSelectCategories.resultFunc(state));

// map subcategories to prevent a warning about non-unique keys rendered by input elements 🙄
export const subcategoriesWithUniqueKeys = subCategories.map(subcategory => ({
  ...subcategory,
  value: subcategory.name,
  key: subcategory._links.self.href,
}));

export const departments = {
  ...departmentsFixture,
  count: departmentsFixture.count,
  list: departmentsFixture.results,
  results: undefined,
};

export const directingDepartments = makeSelectDirectingDepartments.resultFunc(
  makeSelectDepartments.resultFunc(fromJS(departments))
);

export const subcategoriesGroupedByCategories = makeSelectSubcategoriesGroupedByCategories.resultFunc(
  mainCategories,
  subCategories
);

export const handlingTimesBySlug = {
  ...makeSelectHandlingTimesBySlug.resultFunc(subCategories),
  beplanting: '1 werkdag',
  bewegwijzering: '1 dag',
};
