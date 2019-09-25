import {
  makeSelectCategories,
  makeSelectDataLists,
} from 'containers/App/selectors';
import { parseFilterData } from 'signals/incident-management/services/filter/parse';
import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the overviewPage state domain
 */
const selectOverviewPageDomain = (state) =>
  state.get('incidentOverviewPage') || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by OverviewPage
 */

const makeSelectOverviewPage = () =>
  createSelector(
    selectOverviewPageDomain,
    (substate) => substate.toJS(),
  );

const makeSelectIncidentsCount = createSelector(
  selectOverviewPageDomain,
  (state) => {
    if (!state) return state;

    const obj = state.toJS();

    return obj.incidentsCount;
  },
);

const makeSelectFilterParams = () =>
  createSelector(
    selectOverviewPageDomain,
    (substate) => {
      const state = substate.toJS();
      const filter = state.filter || { options: {} };
      const { options } = filter;
      if (options && options.id) {
        delete options.id;
      }
debugger;
      if (filter.searchQuery) {
        return {
          id: filter.searchQuery,
          page: state.page,
          ordering: state.sort,
        };
      }

      return { ...options, page: state.page, ordering: state.sort };
    },
  );

export default makeSelectOverviewPage;
export {
  selectOverviewPageDomain,
  makeSelectFilterParams,
  makeSelectIncidentsCount,
};

export const makeSelectAllFilters = createSelector(
  selectOverviewPageDomain,
  makeSelectCategories(),
  makeSelectDataLists(),
  (stateMap, { sub: category_slug, main: maincategory_slug }, dataLists) => {
    const state = stateMap.toJS();
    const dataMap = {
      category_slug,
      maincategory_slug,
      ...dataLists,
    };

    return state.allFilters.map((filter) => parseFilterData(filter, dataMap));
  },
);

export const makeSelectFilter = createSelector(
  selectOverviewPageDomain,
  makeSelectCategories(),
  makeSelectDataLists(),
  (stateMap, { sub: category_slug, main: maincategory_slug }, dataLists) => {
    const state = stateMap.toJS();
    const dataMap = {
      category_slug,
      maincategory_slug,
      ...dataLists,
    };

    if (!state.filter.id) {
      return {};
    }

    return parseFilterData(state.filter, dataMap);
  },
);
