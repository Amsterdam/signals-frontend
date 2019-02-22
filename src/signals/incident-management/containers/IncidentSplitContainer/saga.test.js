import { put, push, takeLatest } from 'redux-saga/effects';

import CONFIGURATION from 'shared/services/configuration/configuration';

import { authPatchCall, authPostCall } from 'shared/services/api/api';
import { SPLIT_INCIDENT } from './constants';
import { splitIncidentSuccess, splitIncidentError } from './actions';
import watchIncidentDetailContainerSaga, { splitIncident } from './saga';

jest.mock('shared/services/api/api');

describe('IncidentSplitContainer saga', () => {
  const id = 42;
  const requestURL = `${CONFIGURATION.API_ROOT}signals/v1/private/signals`;
  const action = {
    payload: {
      id,
      create: [{ test: 'text 1' }, { text: 'text 2' }, { text: 'text 3' }],
      update: [{ category: 'fo' }, { category: 'ba' }, { category: 'ba' }]
    }
  };

  it('should watchIncidentDetailContainerSaga', () => {
    const gen = watchIncidentDetailContainerSaga();
    expect(gen.next().value).toEqual(
      takeLatest(SPLIT_INCIDENT, splitIncident)
    );
  });

  it('should splitIncident success', () => {
    const created = {
      children: [{ id: 43 }, { id: 44 }, { id: 45 }]
    };
    const gen = splitIncident(action);
    expect(gen.next().value).toEqual(authPostCall(`${requestURL}/${id}/split`, action.payload.create));
    expect(gen.next(created).value).toEqual(authPatchCall(`${requestURL}/${id}/split${created.children[0].id}`, action.payload.update[0]));
    expect(gen.next().value).toEqual(authPatchCall(`${requestURL}/${id}/split${created.children[1].id}`, action.payload.update[1]));
    expect(gen.next().value).toEqual(authPatchCall(`${requestURL}/${id}/split${created.children[2].id}`, action.payload.update[2]));
    expect(gen.next().value).toEqual(put(splitIncidentSuccess({ id, created })));
    expect(gen.next().value).toEqual(put(push(`/manage/incident/${id}`)));
  });

  it('should fetchIncident error', () => {
    const error = new Error('404 Not Found');

    const gen = splitIncident(action);
    gen.next();
    expect(gen.throw(error).value).toEqual(put(splitIncidentError(error))); // eslint-disable-line redux-saga/yield-effects
  });
});
