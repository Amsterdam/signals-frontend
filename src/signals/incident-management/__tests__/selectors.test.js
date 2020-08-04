import { fromJS } from 'immutable';
import configuration from 'shared/services/configuration/configuration';
import { mainCategories as maincategory_slug, subCategories as category_slug } from 'utils/__tests__/fixtures';
import {
  makeSelectDistricts,
  makeSelectFilterParams,
  makeSelectAllFilters,
  makeSelectActiveFilter,
  makeSelectEditFilter,
  makeSelectPage,
  makeSelectOrdering,
  makeSelectIncidents,
  makeSelectIncidentsCount,
} from '../selectors';
import { FILTER_PAGE_SIZE } from '../constants';

import { initialState } from '../reducer';

const filters = [
  {
    _links: {
      self: {
        href: 'https://signals/v1/private/me/filters/219',
      },
    },
    id: 219,
    options: {
      maincategory_slug: ['afval'],
    },
    name: 'Foo Bar',
  },
  {
    _links: {
      self: {
        href: 'https://signals/v1/private/me/filters/220',
      },
    },
    id: 220,
    options: {
      stadsdeel: ['B', 'E'],
    },
    name: 'Foo Bar',
  },
  {
    _links: {
      self: {
        href: 'https://signals/v1/private/me/filters/221',
      },
    },
    id: 221,
    options: {
      status: ['m'],
    },
    name: 'Foo Bar',
  },
  {
    _links: {
      self: {
        href: 'https://signals/v1/private/me/filters/222',
      },
    },
    id: 222,
    options: {
      area: ['north'],
    },
    name: 'Foo Bar',
  },
];

const districts = [
  {
    code: 'A',
    name: 'Alfa',
  },
  {
    code: 'B',
    name: 'Bravo',
  },
];
const selectedDistricts = [
  {
    key: 'A',
    value: 'Alfa',
  },
  {
    key: 'B',
    value: 'Bravo',
  },
  {
    key: 'null',
    value: 'Niet bepaald',
  },
];

const selectedSources = [
  {
    key: '1',
    value: 'Source1',
  },
  {
    key: '2',
    value: 'Source2',
  },
];

describe('signals/incident-management/selectors', () => {
  it('should select districts', () => {
    const state = fromJS({ ...initialState.toJS(), districts });
    const result = makeSelectDistricts.resultFunc(state);

    expect(result.length).toEqual(districts.length + 1);
    expect(result[0]).toMatchObject(selectedDistricts[0]);
    expect(result[1]).toMatchObject(selectedDistricts[1]);
    expect(result[2]).toMatchObject(selectedDistricts[2]);
  });

  it('should return null without districts', () => {
    const result = makeSelectDistricts.resultFunc(initialState);

    expect(result).toBeNull();
  });

  it('should select all filters', () => {
    const state = fromJS({ ...initialState.toJS(), filters });
    const allFilters = makeSelectAllFilters.resultFunc(state, maincategory_slug, category_slug);

    expect(allFilters.length).toEqual(filters.length);
    expect(allFilters[0].options.maincategory_slug).not.toEqual(filters[0].options.maincategory_slug);
  });

  it('should select active filter', () => {
    const activeFilter = initialState.toJS().activeFilter;
    activeFilter.options.priority = [];

    expect(
      makeSelectActiveFilter.resultFunc(
        initialState,
        selectedDistricts,
        selectedSources,
        maincategory_slug,
        category_slug
      )
    ).toEqual(activeFilter);

    const state = fromJS({ ...initialState.toJS(), activeFilter: filters[0] });

    expect(
      makeSelectActiveFilter.resultFunc(state, selectedDistricts, selectedSources, maincategory_slug, category_slug).id
    ).toEqual(filters[0].id);
  });

  it('should select edit filter', () => {
    expect(
      makeSelectEditFilter.resultFunc(
        initialState,
        selectedDistricts,
        selectedSources,
        maincategory_slug,
        category_slug
      )
    ).toEqual(initialState.toJS().editFilter);

    const state = fromJS({ ...initialState.toJS(), editFilter: filters[2] });

    expect(
      makeSelectEditFilter.resultFunc(state, selectedDistricts, selectedSources, maincategory_slug, category_slug).id
    ).toEqual(filters[2].id);
  });

  it('should select page', () => {
    const emptState = fromJS({
      incidentManagement: { ...initialState.toJS() },
    });
    expect(makeSelectPage(emptState)).toEqual(initialState.toJS().page);

    const state = fromJS({
      incidentManagement: { ...initialState.toJS(), page: 100 },
    });

    expect(makeSelectPage(state)).toEqual(100);
  });

  it('should select ordering', () => {
    const emptState = fromJS({
      incidentManagement: { ...initialState.toJS() },
    });
    expect(makeSelectOrdering(emptState)).toEqual(initialState.toJS().ordering);

    const state = fromJS({
      incidentManagement: { ...initialState.toJS(), ordering: 'some-ordering-type' },
    });

    expect(makeSelectOrdering(state)).toEqual('some-ordering-type');
  });

  it('should select incidents', () => {
    const results = [...new Array(10).keys()].map(index => ({
      id: index + 1,
    }));

    const incidents = { count: 100, results };

    const stateLoading = fromJS({
      incidentManagement: { ...initialState.toJS(), loadingIncidents: true, incidents },
    });

    expect(makeSelectIncidents(stateLoading)).toEqual({ ...incidents, loadingIncidents: true });

    const state = fromJS({
      incidentManagement: { ...initialState.toJS(), incidents },
    });

    expect(makeSelectIncidents(state)).toEqual({ ...incidents, loadingIncidents: false });
  });

  it('should select incidents count', () => {
    const emptState = fromJS({
      incidentManagement: { ...initialState.toJS() },
    });

    expect(makeSelectIncidentsCount(emptState)).toEqual(initialState.toJS().incidents.count);

    const count = 909;
    const state = fromJS({
      incidentManagement: { ...initialState.toJS(), incidents: { count } },
    });

    expect(makeSelectIncidentsCount(state)).toEqual(count);
  });

  describe('makeSelectFilterParams', () => {
    it('should select filter params', () => {
      const emptyState = fromJS({
        incidentManagement: { ...initialState.toJS(), editFilter: filters[1], searchQuery: '' },
      });

      expect(makeSelectFilterParams(emptyState)).toEqual({
        ordering: '-created_at',
        page: 1,
        page_size: FILTER_PAGE_SIZE,
      });

      const state = fromJS({
        incidentManagement: { ...initialState.toJS(), activeFilter: filters[1] },
      });

      expect(makeSelectFilterParams(state)).toEqual({
        ordering: '-created_at',
        page: 1,
        stadsdeel: ['B', 'E'],
        page_size: FILTER_PAGE_SIZE,
      });
    });

    it('should select filter params for area', () => {
      configuration.areaTypeCodeForDistrict = 'district';
      const state = fromJS({
        incidentManagement: { ...initialState.toJS(), activeFilter: filters[3] },
      });

      expect(makeSelectFilterParams(state)).toEqual({
        ordering: '-created_at',
        page: 1,
        area_code: ['north'],
        area_type_code: 'district',
        page_size: FILTER_PAGE_SIZE,
      });
    });

    it('should reformat days_open', () => {
      const state1 = fromJS({
        incidentManagement: { ...initialState.toJS(), ordering: 'days_open' },
      });

      expect(makeSelectFilterParams(state1)).toEqual({
        ordering: '-created_at',
        page: 1,
        page_size: FILTER_PAGE_SIZE,
      });

      const state2 = fromJS({
        incidentManagement: { ...initialState.toJS(), ordering: '-days_open' },
      });

      expect(makeSelectFilterParams(state2)).toEqual({
        ordering: 'created_at',
        page: 1,
        page_size: FILTER_PAGE_SIZE,
      });
    });
  });
});
