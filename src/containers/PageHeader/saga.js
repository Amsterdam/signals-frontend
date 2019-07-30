import { spawn } from 'redux-saga/effects';
import filterSaga from 'signals/incident-management/containers/Filter/saga';

export default function* watchPageHeaderSaga() {
  yield spawn(filterSaga);
}
