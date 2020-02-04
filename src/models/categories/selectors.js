import { createSelector } from 'reselect';
import { initialState } from './reducer';

export const selectCategoriesDomain = state =>
  (state && state.get('categories')) || initialState;

export const makeSelectCategories = createSelector(
  selectCategoriesDomain,
  state => {
    const {
      categories: { results },
    } = state.toJS();

    if (!results) {
      return undefined;
    }

    return results;
  }
);

export const filterForMain = ({ _links }) => _links['sia:parent'] === undefined;

/**
 * Get all category objects
 *
 * @returns {Object[]}
 */
export const makeSelectMainCategories = createSelector(
  makeSelectCategories,
  state => {
    if (!state) {
      return undefined;
    }

    return state.filter(filterForMain);
  }
);

export const filterForSub = ({ _links }) => _links['sia:parent'] !== undefined;

/**
 * Get all subcategory objects
 *
 * @returns {Object[]}
 */
export const makeSelectSubCategories = createSelector(
  makeSelectCategories,
  state => {
    if (!state) {
      return undefined;
    }

    return state.filter(filterForSub);
  }
);

/**
 * Get all subcategory objects by main category slug
 *
 * @param {String} slug - Main category slug
 * @returns {Object[]}
 */
export const makeSelectByMainCategory = createSelector(
  makeSelectSubCategories,
  state => slug => {
    if (!state) {
      return undefined;
    }

    return state.filter(({ _links }) =>
      new RegExp(`/terms/categories/${slug}`).test(
        _links['sia:parent'].public
      )
    );
  }
);

/**
 * Get all subcategories, grouped by main category
 *
 * @returns {Object}
 */
export const makeSelectStructuredCategories = createSelector(
  [makeSelectMainCategories, makeSelectSubCategories, makeSelectByMainCategory],
  (main, byMain) => {
    if (!main) {
      return undefined;
    }

    return main.reduce(
      (acc, { slug }) => ({ ...acc, [slug]: byMain(slug) }),
      {}
    );
  }
);
