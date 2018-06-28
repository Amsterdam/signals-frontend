import { call, put, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';

import { GET_GEO } from './constants';
import { setGeoName } from './actions';

export function* getGeo(data) {
  const GEO_ENDPOINT = 'https://api.data.amsterdam.nl/geosearch/atlas/';
  const REQUEST_URL = `${GEO_ENDPOINT}?lat=${data.latlng.lat}&lon=${data.latlng.lng}&radius=0`;
  try {
    const apiResponse = yield call(request, REQUEST_URL);
    yield put(setGeoName(apiResponse.features[0].properties.display, data.latlng));
  } catch (err) {
    console.error('Something went wrong', err);
  }
}


export default function* watchMapContainerSaga() {
  yield takeLatest(GET_GEO, getGeo);
}
