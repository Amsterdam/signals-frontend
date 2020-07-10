import { all, call, delay, put, race, select, spawn, take, takeLatest } from 'redux-saga/effects';
import { push } from 'connected-react-router/immutable';

import { authCall, authDeleteCall, authPatchCall, authPostCall } from 'shared/services/api/api';

import CONFIGURATION from 'shared/services/configuration/configuration';

import { makeSelectSearchQuery } from 'containers/App/selectors';
import { SET_SEARCH_QUERY, RESET_SEARCH_QUERY } from 'containers/App/constants';

import {
  applyFilterRefresh,
  applyFilterRefreshStop,
  filterSaveFailed,
  filterSaveSuccess,
  filterUpdatedFailed,
  filterUpdatedSuccess,
  getDistrictsFailed,
  getDistrictsSuccess,
  getFilters,
  getFiltersFailed,
  getFiltersSuccess,
  removeFilterFailed,
  removeFilterSuccess,
  requestIncidents,
  requestIncidentsError,
  requestIncidentsSuccess,
  searchIncidentsError,
  searchIncidentsSuccess,
} from './actions';

import {
  APPLY_FILTER_REFRESH_STOP,
  APPLY_FILTER_REFRESH,
  APPLY_FILTER,
  GET_DISTRICTS,
  GET_FILTERS,
  ORDERING_CHANGED,
  PAGE_CHANGED,
  REMOVE_FILTER,
  REQUEST_INCIDENTS,
  SAVE_FILTER,
  SEARCH_INCIDENTS,
  UPDATE_FILTER,
  PATCH_INCIDENT_SUCCESS,
} from './constants';

import { SPLIT_INCIDENT_SUCCESS } from './containers/IncidentSplitContainer/constants';

import { makeSelectActiveFilter, makeSelectFilterParams } from './selectors';

export function* fetchProxy(action) {
  const searchQuery = yield select(makeSelectSearchQuery);

  if (searchQuery) {
    yield call(searchIncidents, action);
  } else {
    yield call(fetchIncidents);
  }
}

export function* fetchIncidents() {
  try {
    const filter = yield select(makeSelectActiveFilter);

    if (filter && filter.refresh) {
      yield put(applyFilterRefreshStop());
    }

    const params = yield select(makeSelectFilterParams);

    const incidents = yield call(authCall, CONFIGURATION.INCIDENTS_ENDPOINT, params);

    yield put(requestIncidentsSuccess(incidents));

    if (filter && filter.refresh) {
      yield put(applyFilterRefresh());
    }
  } catch (error) {
    yield put(requestIncidentsError(error.message));
  }
}

export function* searchIncidents() {
  try {
    const q = yield select(makeSelectSearchQuery);

    yield put(applyFilterRefreshStop());

    const { page, page_size, ordering } = yield select(makeSelectFilterParams);

    const incidents = yield call(authCall, CONFIGURATION.SEARCH_ENDPOINT, {
      q,
      page,
      page_size,
      ordering,
    });

    yield put(searchIncidentsSuccess(incidents));
  } catch (error) {
    if (error.response && error.response.status === 500) {
      // Getting an error response with status code 500 from the search endpoint
      // means that the Elasticsearch index is very likely corrupted. In that
      // case we simulate a success response without results.
      yield put(push('/manage/incidents'));
      yield put(searchIncidentsSuccess({ count: 0, results: [] }));
    }

    yield put(searchIncidentsError(error.message));
  }
}

export const refreshRequestDelay = 2 * 60 * 1000;

export function* refreshIncidents(timeout = refreshRequestDelay) {
  while (true) {
    const filter = yield select(makeSelectActiveFilter);

    if (filter && filter.refresh) {
      yield delay(timeout);
      yield put(requestIncidents());
    } else {
      break;
    }
  }
}

export function* fetchDistricts() {
  try {
    const result = yield call(authCall, CONFIGURATION.AREAS_ENDPOINT, {
      type_code: 'stadsdeel',
    });

    yield put(getDistrictsSuccess(result.results));
  } catch (error) {
    yield put(getDistrictsFailed(error.message));
  }
}

export function* fetchFilters() {
  try {
    const result = yield call(authCall, CONFIGURATION.FILTERS_ENDPOINT);

    yield put(getFiltersSuccess(result.results));
  } catch (error) {
    yield put(getFiltersFailed(error.message));
  }
}

export function* removeFilter(action) {
  const id = action.payload;

  try {
    yield call(authDeleteCall, `${CONFIGURATION.FILTERS_ENDPOINT}${id}`);
    yield put(removeFilterSuccess(id));
  } catch (error) {
    yield put(removeFilterFailed(error.message));
  }
}

export function* doSaveFilter(action) {
  const filterData = action.payload;

  try {
    if (filterData.name) {
      const result = yield call(authPostCall, CONFIGURATION.FILTERS_ENDPOINT, filterData);

      yield put(filterSaveSuccess(result));
      yield put(getFilters());
    } else {
      yield put(filterSaveFailed('No name supplied'));
    }
  } catch (error) {
    if (error.response && error.response.status >= 400 && error.response.status < 500) {
      yield put(filterSaveFailed('Invalid data supplied'));
    } else if (error.response && error.response.status >= 500) {
      yield put(filterSaveFailed('Internal server error'));
    } else {
      yield put(filterSaveFailed(error));
    }
  }
}

export function* doUpdateFilter(action) {
  const { name, refresh, id, options } = action.payload;

  try {
    const result = yield call(authPatchCall, `${CONFIGURATION.FILTERS_ENDPOINT}${id}`, {
      name,
      refresh,
      options,
    });

    yield put(filterUpdatedSuccess(result));
    yield put(getFilters());
  } catch (error) {
    if (error.response && error.response.status >= 400 && error.response.status < 500) {
      yield put(filterUpdatedFailed('Invalid data supplied'));
    } else if (error.response && error.response.status >= 500) {
      yield put(filterUpdatedFailed('Internal server error'));
    } else {
      yield put(filterUpdatedFailed(error));
    }
  }
}

export function* saveFilter(action) {
  yield spawn(doSaveFilter, action);
}

export function* updateFilter(action) {
  yield spawn(doUpdateFilter, action);
}

export default function* watchIncidentManagementSaga() {
  yield all([
    takeLatest(GET_DISTRICTS, fetchDistricts),
    takeLatest(GET_FILTERS, fetchFilters),
    takeLatest(REMOVE_FILTER, removeFilter),
    takeLatest(SAVE_FILTER, saveFilter),
    takeLatest(UPDATE_FILTER, updateFilter),
    takeLatest(
      [
        APPLY_FILTER,
        SEARCH_INCIDENTS,
        REQUEST_INCIDENTS,
        SET_SEARCH_QUERY,
        RESET_SEARCH_QUERY,
        PAGE_CHANGED,
        ORDERING_CHANGED,
        PATCH_INCIDENT_SUCCESS,
        SPLIT_INCIDENT_SUCCESS,
      ],
      fetchProxy
    ),
  ]);

  while (true) {
    yield take(APPLY_FILTER_REFRESH);
    yield race([call(refreshIncidents), take(APPLY_FILTER_REFRESH_STOP)]);
  }
}
