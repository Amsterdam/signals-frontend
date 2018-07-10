import { call, put, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';

import { GET_GEO } from './constants';
import { setGeoName } from './actions';
import { showGlobalError } from '../App/actions';

export function* getGeo(data) {
  const GEO_ENDPOINT = 'https://api.data.amsterdam.nl/geosearch/atlas/';
  const REQUEST_URL = `${GEO_ENDPOINT}?lat=${data.latlng.lat}&lon=${data.latlng.lng}&radius=0`;
  try {
    const apiResponse = yield call(request, REQUEST_URL);
    const payload = { location: apiResponse.features[0].properties.display, latlng: data.latlng };
    yield put(setGeoName(payload));
  } catch (error) {
      // console.error('Something went wrong', error);
    yield put(showGlobalError(error));
  }
}

export default function* watchMapContainerSaga() {
  yield takeLatest(GET_GEO, getGeo);
}
