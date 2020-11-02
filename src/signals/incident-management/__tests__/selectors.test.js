import { fromJS } from 'immutable';
import configuration from 'shared/services/configuration/configuration';
import dataLists from 'signals/incident-management/definitions';
import { mainCategories as maincategory_slug, subCategories as category_slug } from 'utils/__tests__/fixtures';
import districts from 'utils/__tests__/fixtures/districts.json';
import sources from 'utils/__tests__/fixtures/sources.json';
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

jest.mock('shared/services/configuration/configuration');

const filters = [
  {
    _links: {
      self: {
        href: 'https://signals/v1/private/me/filters/219',
      },
    },
    id: 219,
    options: {
      maincategory_slug: [maincategory_slug[0].slug],
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
      category_slug: [category_slug[0].slug],
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
      stadsdeel: [dataLists.stadsdeel[1].key, dataLists.stadsdeel[2].key],
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
      status: [dataLists.status[0].key],
    },
    name: 'Foo Bar',
  },
  {
    _links: {
      self: {
        href: 'https://signals/v1/private/me/filters/223',
      },
    },
    id: 223,
    options: {
      area: [districts[0].key],
    },
    name: 'Foo Bar',
  },
  {
    _links: {
      self: {
        href: 'https://signals/v1/private/me/filters/224',
      },
    },
    id: 224,
    options: {
      source: [sources[0].key],
    },
    name: 'Foo Bar',
  },
];

const mainCategoryFilter = filters[0];
const subCategoryFilter = filters[1];
const stadsdeelFilter = filters[2];
const statusFilter = filters[3];
const areaFilter = filters[4];
const sourceFilter = filters[5];

const rawDistricts = [
  {
    code: districts[0].key,
    name: districts[0].value,
  },
  {
    code: districts[1].key,
    name: districts[1].value,
  },
];

describe('signals/incident-management/selectors', () => {
  afterEach(() => {
    configuration.__reset();
  });

  it('should select districts', () => {
    const state = fromJS({ ...initialState.toJS(), districts: rawDistricts });
    const result = makeSelectDistricts.resultFunc(state);

    expect(result.length).toEqual(rawDistricts.length + 1);
    expect(result[0]).toMatchObject(districts[0]);
    expect(result[1]).toMatchObject(districts[1]);
    expect(result[2]).toMatchObject(districts[2]);
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

  describe('active filter', () => {
    it('should select initial active filter', () => {
      const activeFilter = initialState.toJS().activeFilter;
      activeFilter.options.priority = [];

      expect(
        makeSelectActiveFilter.resultFunc(initialState, districts, sources, maincategory_slug, category_slug)
      ).toEqual(activeFilter);
    });

    it('should select active category filter', () => {
      const state = fromJS({ ...initialState.toJS(), activeFilter: mainCategoryFilter });
      const actual = makeSelectActiveFilter.resultFunc(state, districts, sources, maincategory_slug, category_slug);

      expect(actual.id).toEqual(mainCategoryFilter.id);
      expect(actual.options).toEqual({
        maincategory_slug: [maincategory_slug[0]],
        priority: [],
      });
    });

    it('should select active sub category filter', () => {
      const state = fromJS({ ...initialState.toJS(), activeFilter: subCategoryFilter });
      const actual = makeSelectActiveFilter.resultFunc(state, districts, sources, maincategory_slug, category_slug);

      expect(actual.id).toEqual(subCategoryFilter.id);
      expect(actual.options).toEqual({
        category_slug: [category_slug[0]],
        priority: [],
      });
    });

    it('should select active stadsdeel filter', () => {
      const state = fromJS({ ...initialState.toJS(), activeFilter: stadsdeelFilter });
      const actual = makeSelectActiveFilter.resultFunc(state, districts, sources, maincategory_slug, category_slug);

      expect(actual.id).toEqual(stadsdeelFilter.id);
      expect(actual.options).toEqual({
        stadsdeel: [dataLists.stadsdeel[1], dataLists.stadsdeel[2]],
        priority: [],
      });
    });

    it('should select active status filter', () => {
      const state = fromJS({ ...initialState.toJS(), activeFilter: statusFilter });
      const actual = makeSelectActiveFilter.resultFunc(state, districts, sources, maincategory_slug, category_slug);

      expect(actual.id).toEqual(statusFilter.id);
      expect(actual.options).toEqual({
        status: [dataLists.status[0]],
        priority: [],
      });
    });

    it('should select active area filter', () => {
      const state = fromJS({ ...initialState.toJS(), activeFilter: areaFilter });
      const actual = makeSelectActiveFilter.resultFunc(state, districts, sources, maincategory_slug, category_slug);

      expect(actual.id).toEqual(areaFilter.id);
      expect(actual.options).toEqual({
        area: [districts[0]],
        priority: [],
      });
    });

    it('should not select active source filter when sources are empty', () => {
      const state = fromJS({ ...initialState.toJS(), activeFilter: sourceFilter });
      const actual = makeSelectActiveFilter.resultFunc(state, districts, null, maincategory_slug, category_slug);

      expect(actual.id).toEqual(sourceFilter.id);
      expect(actual.options).toEqual({
        source: [],
        priority: [],
      });
    });

    it('should select active source filter', () => {
      const state = fromJS({ ...initialState.toJS(), activeFilter: sourceFilter });
      const actual = makeSelectActiveFilter.resultFunc(state, districts, sources, maincategory_slug, category_slug);

      expect(actual.id).toEqual(sourceFilter.id);
      expect(actual.options).toEqual({
        source: [sources[0]],
        priority: [],
      });
    });
  });

  describe('edit filter', () => {
    it('should select initial edit filter', () => {
      const editFilter = initialState.toJS().editFilter;

      expect(
        makeSelectEditFilter.resultFunc(initialState, districts, sources, maincategory_slug, category_slug)
      ).toEqual(editFilter);
    });

    it('should select edit category filter', () => {
      const state = fromJS({ ...initialState.toJS(), editFilter: mainCategoryFilter });
      const actual = makeSelectEditFilter.resultFunc(state, districts, sources, maincategory_slug, category_slug);

      expect(actual.id).toEqual(mainCategoryFilter.id);
      expect(actual.options).toEqual({
        maincategory_slug: [maincategory_slug[0]],
      });
    });

    it('should select edit sub category filter', () => {
      const state = fromJS({ ...initialState.toJS(), editFilter: subCategoryFilter });
      const actual = makeSelectEditFilter.resultFunc(state, districts, sources, maincategory_slug, category_slug);

      expect(actual.id).toEqual(subCategoryFilter.id);
      expect(actual.options).toEqual({
        category_slug: [category_slug[0]],
      });
    });

    it('should select edit stadsdeel filter', () => {
      const state = fromJS({ ...initialState.toJS(), editFilter: stadsdeelFilter });
      const actual = makeSelectEditFilter.resultFunc(state, districts, sources, maincategory_slug, category_slug);

      expect(actual.id).toEqual(stadsdeelFilter.id);
      expect(actual.options).toEqual({
        stadsdeel: [dataLists.stadsdeel[1], dataLists.stadsdeel[2]],
      });
    });

    it('should select edit status filter', () => {
      const state = fromJS({ ...initialState.toJS(), editFilter: statusFilter });
      const actual = makeSelectEditFilter.resultFunc(state, districts, sources, maincategory_slug, category_slug);

      expect(actual.id).toEqual(statusFilter.id);
      expect(actual.options).toEqual({
        status: [dataLists.status[0]],
      });
    });

    it('should select edit area filter', () => {
      const state = fromJS({ ...initialState.toJS(), editFilter: areaFilter });
      const actual = makeSelectEditFilter.resultFunc(state, districts, sources, maincategory_slug, category_slug);

      expect(actual.id).toEqual(areaFilter.id);
      expect(actual.options).toEqual({
        area: [districts[0]],
      });
    });

    it('should select edit source filter', () => {
      const state = fromJS({ ...initialState.toJS(), editFilter: sourceFilter });
      const actual = makeSelectEditFilter.resultFunc(state, districts, sources, maincategory_slug, category_slug);

      expect(actual.id).toEqual(sourceFilter.id);
      expect(actual.options).toEqual({
        source: [sources[0]],
      });
    });

    it('should not work without sources', () => {
      const state = fromJS({ ...initialState.toJS(), editFilter: sourceFilter });
      const actual = makeSelectEditFilter.resultFunc(state, districts, null, maincategory_slug, category_slug);

      expect(actual.id).toEqual(sourceFilter.id);
      expect(actual.options).toEqual({
        source: [],
      });
    });

    it('should select edit source filter', () => {
      const state = fromJS({ ...initialState.toJS(), editFilter: sourceFilter });
      const actual = makeSelectEditFilter.resultFunc(state, districts, sources, maincategory_slug, category_slug);

      expect(actual.id).toEqual(sourceFilter.id);
      expect(actual.options).toEqual({
        source: [sources[0]],
      });
    });

    it('should not work without sources', () => {
      const state = fromJS({ ...initialState.toJS(), editFilter: sourceFilter });
      const actual = makeSelectEditFilter.resultFunc(state, districts, null, maincategory_slug, category_slug);

      expect(actual.id).toEqual(sourceFilter.id);
      expect(actual.options).toEqual({
        source: [],
      });
    });
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
        incidentManagement: { ...initialState.toJS(), editFilter: stadsdeelFilter, searchQuery: '' },
      });

      expect(makeSelectFilterParams(emptyState)).toEqual({
        ordering: '-created_at',
        page: 1,
        page_size: FILTER_PAGE_SIZE,
      });

      const state = fromJS({
        incidentManagement: { ...initialState.toJS(), activeFilter: stadsdeelFilter },
      });

      expect(makeSelectFilterParams(state)).toEqual({
        ordering: '-created_at',
        page: 1,
        stadsdeel: stadsdeelFilter.options.stadsdeel,
        page_size: FILTER_PAGE_SIZE,
      });
    });

    it('should select filter params for area', () => {
      configuration.areaTypeCodeForDistrict = 'district';
      const state = fromJS({
        incidentManagement: { ...initialState.toJS(), activeFilter: areaFilter },
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
