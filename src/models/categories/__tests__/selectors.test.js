import { fromJS } from 'immutable';

import categoriesJson from 'utils/__tests__/fixtures/categories_private.json';

import { initialState } from '../reducer';
import {
  selectCategoriesDomain,
  makeSelectCategories,
  makeSelectMainCategories,
  makeSelectSubCategories,
  makeSelectByMainCategory,
  makeSelectStructuredCategories,
  filterForMain,
  filterForSub,
} from '../selectors';

const state = fromJS({
  error: false,
  errorMessage: false,
  categories: {
    ...categoriesJson,
    results: categoriesJson.results,
  },
  loading: false,
});

describe('models/categories/selectors', () => {
  test('selectCategoriesDomain', () => {
    expect(selectCategoriesDomain()).toEqual(initialState);

    const categoriesDomain = fromJS({
      categories: state.toJS(),
    });

    expect(selectCategoriesDomain(categoriesDomain)).toEqual(state);
  });

  test('makeSelectCategories', () => {
    expect(makeSelectCategories.resultFunc(fromJS(initialState))).toBeUndefined();

    expect(makeSelectCategories.resultFunc(state)).toEqual(
      categoriesJson.results
    );
  });

  test('makeSelectMainCategories', () => {
    expect(makeSelectMainCategories.resultFunc()).toBeUndefined();

    const results = state
      .get('categories')
      .get('results')
      .toJS();

    expect(makeSelectMainCategories.resultFunc(results)).toEqual(
      categoriesJson.results.filter(filterForMain)
    );
  });

  test('makeSelectSubCategories', () => {
    expect(makeSelectSubCategories.resultFunc()).toBeUndefined();

    const results = state
      .get('categories')
      .get('results')
      .toJS();

    expect(makeSelectSubCategories.resultFunc(results)).toEqual(
      categoriesJson.results.filter(filterForSub)
    );
  });

  test('makeSelectByMainCategory', () => {
    const subCategories = categoriesJson.results.filter(filterForSub);
    const slug = 'afval';
    const count = subCategories.filter(
      ({ _links }) => _links['sia:parent'].public.indexOf(slug) > 0
    ).length;

    expect(makeSelectByMainCategory.resultFunc()(slug)).toBeUndefined();

    expect(
      makeSelectByMainCategory.resultFunc(subCategories)(slug)
    ).toHaveLength(count);
  });

  test('makeSelectStructuredCategories', () => {
    const mainCategories = categoriesJson.results.filter(filterForMain);
    const count = categoriesJson.results.filter(filterForMain).length;
    const structuredCategories = makeSelectStructuredCategories.resultFunc(
      mainCategories,
      makeSelectByMainCategory.resultFunc
    );

    expect(makeSelectStructuredCategories.resultFunc()).toBeUndefined();

    expect(Object.keys(structuredCategories)).toHaveLength(count);
  });
});
