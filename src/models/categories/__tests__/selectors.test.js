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
  categories: categoriesJson,
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
    expect(makeSelectCategories.resultFunc(fromJS(initialState))).toBeNull();

    const categories = makeSelectCategories.resultFunc(state);
    const first = categories.first().toJS();

    const firstWithExtraProps = categoriesJson.results[0];
    firstWithExtraProps.id = firstWithExtraProps._links.self.public;
    firstWithExtraProps.key = firstWithExtraProps._links.self.public;
    firstWithExtraProps.parentKey = false;
    firstWithExtraProps.value = firstWithExtraProps.name;

    expect(first).toEqual(firstWithExtraProps);

    const second = categories
      .skip(1)
      .first()
      .toJS();

    const secondWithExtraProps = categoriesJson.results[1];
    secondWithExtraProps.id = secondWithExtraProps._links.self.public;
    secondWithExtraProps.key = secondWithExtraProps._links.self.public;
    secondWithExtraProps.parentKey =
      secondWithExtraProps._links['sia:parent'].public;
    secondWithExtraProps.value = secondWithExtraProps.name;

    expect(second).toEqual(secondWithExtraProps);
  });

  test('makeSelectMainCategories', () => {
    expect(makeSelectMainCategories.resultFunc()).toBeNull();

    const mainCategories = makeSelectMainCategories.resultFunc(
      makeSelectCategories.resultFunc(state)
    );
    const slugs = mainCategories.map(({ slug }) => slug);
    const keys = categoriesJson.results
      .filter(filterForMain)
      .map(({ slug }) => slug);

    expect(slugs).toEqual(keys);
  });

  test('makeSelectSubCategories', () => {
    expect(makeSelectSubCategories.resultFunc()).toBeNull();

    const subCategories = makeSelectSubCategories.resultFunc(
      makeSelectCategories.resultFunc(state)
    );
    const slugs = subCategories.map(({ slug }) => slug).sort();
    const keys = categoriesJson.results
      .filter(filterForSub)
      .map(({ slug }) => slug)
      .sort();

    expect(slugs).toEqual(keys);
  });

  test('makeSelectByMainCategory', () => {
    const subCategories = makeSelectSubCategories.resultFunc(
      makeSelectCategories.resultFunc(state)
    );

    const parentKey = categoriesJson.results[0]._links.self.public;
    const count = subCategories.filter(
      ({ _links }) => _links['sia:parent'].public === parentKey
    ).length;

    expect(
      makeSelectByMainCategory.resultFunc()(parentKey)
    ).toBeNull();

    expect(
      makeSelectByMainCategory.resultFunc(subCategories)(parentKey)
    ).toHaveLength(count);
  });

  test('makeSelectStructuredCategories', () => {
    const mainCategories = categoriesJson.results.filter(filterForMain);
    const count = categoriesJson.results.filter(filterForMain).length;
    const structuredCategories = makeSelectStructuredCategories.resultFunc(
      mainCategories,
      makeSelectByMainCategory.resultFunc
    );

    expect(makeSelectStructuredCategories.resultFunc()).toBeNull();

    expect(Object.keys(structuredCategories)).toHaveLength(count);
  });
});
