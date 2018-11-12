import { all, put, takeLatest } from 'redux-saga/effects';
import CONFIGURATION from 'shared/services/configuration/configuration';
// import { authCall } from 'shared/services/api/api';

import { REQUEST_HISTORY_LIST } from './constants';
import { requestHistoryListSuccess, requestHistoryListError } from './actions';

// const baseURL = '/api/auth/auth/status';
export const baseUrl = `${CONFIGURATION.API_ROOT}signals/auth/note`;

export function* fetchIncidentHistoryList(/* action */) {
  // /const signalId = action.payload;
  // const requestURL = `${baseUrl}`;

  try {
    // const incidentHistoryList = yield authCall(requestURL, { _signal__id: signalId });
    const incidentHistoryList = {
      _links: {
        self: {
          href: 'http://127.0.0.1:8000/signals/v1/private/history/?_signal__id=40001&format=json'
        },
        next: {
          href: null
        },
        previous: {
          href: null
        }
      },
      count: 6,
      results: [{
        identifier: 'UPDATE_STATUS_102798',
        when: '2018-10-09T13:44:06.224531+02:00',
        what: 'UPDATE_STATUS',
        action: 'Update status naar: Afgehandeld',
        description: 'bedankt voor uw melding we komen daar morgen voor grofvuil',
        who: 'r.poelgeest@amsterdam.nl',
        _signal: 40001
      }, {
        identifier: 'UPDATE_PRIORITY_40551',
        when: '2018-10-09T13:41:37.550617+02:00',
        what: 'UPDATE_PRIORITY',
        action: 'Prioriteit update naar: Normal',
        description: null,
        who: null,
        _signal: 40001
      }, {
        identifier: 'UPDATE_PRIORITY_40550',
        when: '2018-10-09T13:41:00.576554+02:00',
        what: 'UPDATE_PRIORITY',
        action: 'Prioriteit update naar: Normal',
        description: null,
        who: null,
        _signal: 40001
      }, {
        identifier: 'UPDATE_CATEGORY_ASSIGNMENT_67206',
        when: '2018-10-09T13:41:00.574268+02:00',
        what: 'UPDATE_CATEGORY_ASSIGNMENT',
        action: 'Categorie gewijzigd naar: Grofvuil',
        description: null,
        who: null,
        _signal: 40001
      }, {
        identifier: 'UPDATE_STATUS_102781',
        when: '2018-10-09T13:41:00.572831+02:00',
        what: 'UPDATE_STATUS',
        action: 'Update status naar: Gemeld',
        description: null,
        who: null,
        _signal: 40001
      }, {
        identifier: 'UPDATE_LOCATION_40000',
        when: '2018-10-09T13:41:00.551141+02:00',
        what: 'UPDATE_LOCATION',
        action: 'Locatie gewijzigd',
        description: null,
        who: null,
        _signal: 40001
      }]
    };
    yield put(requestHistoryListSuccess(incidentHistoryList));
  } catch (error) {
    yield put(requestHistoryListError(error));
  }
}

export default function* watchIncidentHistoryContainerSaga() {
  yield all([
    takeLatest(REQUEST_HISTORY_LIST, fetchIncidentHistoryList)
  ]);
}
