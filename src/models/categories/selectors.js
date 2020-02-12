import { Seq } from 'immutable';
import { createSelector } from 'reselect';

import { initialState } from './reducer';

export const selectCategoriesDomain = state =>
  (state && state.get('categories')) || initialState;

export const makeSelectCategories = createSelector(
  selectCategoriesDomain,
  state => {
    const results = state.getIn(['categories', 'results']);

    if (!results) {
      return null;
    }

    return Seq(results).map(category =>
      category
        .set('id', category.getIn(['_links', 'self', 'public']))
        .set('key', category.getIn(['_links', 'self', 'public']))
        .set('value', category.get('name'))
        .set(
          'parentKey',
          category.hasIn(['_links', 'sia:parent']) &&
            category.getIn(['_links', 'sia:parent', 'public'])
        )
    );
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
      return null;
    }

    const categories = state.filter(
      category => category.getIn(['_links', 'sia:parent']) === undefined
    );

    return categories.toJS();
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
      return null;
    }

    const categories = state.filter(
      category => category.getIn(['_links', 'sia:parent']) !== undefined
    );

    return categories.toJS();
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
  state => parentKey => {
    if (!state) {
      return null;
    }

    return state.filter(category => category.parentKey === parentKey);
  }
);

/**
 * Get all subcategories, grouped by main category
 *
 * @returns {Object}
 */
export const makeSelectStructuredCategories = createSelector(
  [makeSelectMainCategories, makeSelectByMainCategory],
  (main, byMain) => {
    if (!main) {
      return null;
    }

    return main.reduce(
      (acc, mainCategory) => ({
        ...acc,
        [mainCategory.slug]: { ...mainCategory, sub: byMain(mainCategory.key) },
      }),
      {}
    );
  }
);
