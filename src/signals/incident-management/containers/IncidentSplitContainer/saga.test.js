import { all, call, put, takeLatest } from 'redux-saga/effects';
import { push } from 'connected-react-router/immutable';
import * as Sentry from '@sentry/browser';
import * as actions from 'containers/App/actions';

import CONFIGURATION from 'shared/services/configuration/configuration';
import { VARIANT_SUCCESS, VARIANT_ERROR, TYPE_LOCAL } from 'containers/Notification/constants';
import { authPatchCall, authPostCall } from 'shared/services/api/api';
import { showGlobalNotification } from 'containers/App/actions';

import formatUpdateIncident from './services/formatUpdateIncident';
import { SPLIT_INCIDENT } from './constants';
import { splitIncidentSuccess, splitIncidentError } from './actions';
import watchIncidentDetailContainerSaga, { splitIncident } from './saga';

jest.mock('shared/services/api/api');
jest.mock('@sentry/browser');
jest.mock('containers/App/actions', () => ({
  __esModule: true,
  ...jest.requireActual('containers/App/actions'),
}));

describe('IncidentSplitContainer saga', () => {
  const id = 42;
  const action = {
    payload: {
      id,
      create: [{ test: 'text 1' }, { text: 'text 2' }, { text: 'text 3' }],
      update: [{ category: 'fo' }, { category: 'ba' }, { category: 'ba' }],
    },
  };

  it('should watchIncidentDetailContainerSaga', () => {
    const gen = watchIncidentDetailContainerSaga();
    expect(gen.next().value).toEqual(takeLatest(SPLIT_INCIDENT, splitIncident));
  });

  it('should splitIncident success', () => {
    const created = {
      children: [{ id: 43 }, { id: 44 }, { id: 45 }],
    };
    const gen = splitIncident(action);
    expect(gen.next().value).toEqual(
      call(authPostCall, `${CONFIGURATION.INCIDENTS_ENDPOINT}${id}/split`, action.payload.create)
    );
    expect(gen.next(created).value).toEqual(
      all(
        created.children.map((child, key) =>
          call(
            authPatchCall,
            `${CONFIGURATION.INCIDENTS_ENDPOINT}${child.id}`,
            formatUpdateIncident(action.payload.update[key])
          )
        )
      )
    );
    expect(gen.next().value).toEqual(put(splitIncidentSuccess({ id, created })));
    expect(gen.next().value).toEqual(put(push(`/manage/incident/${id}`)));
    expect(gen.next().value).toEqual(put(showGlobalNotification({
      title: 'De melding is succesvol gesplitst',
      variant: VARIANT_SUCCESS,
      type: TYPE_LOCAL,
    })));
  });

  it('should fetchIncident error', () => {
    const captureSpy = jest.spyOn(Sentry, 'captureException');
    const notificationSpy = jest.spyOn(actions, 'showGlobalNotification');
    const error = new Error('404 Not Found');

    const gen = splitIncident(action);
    gen.next();
    expect(gen.throw(error).value).toEqual(put(splitIncidentError(error))); // eslint-disable-line redux-saga/yield-effects
    expect(gen.next().value).toEqual(put(push(`/manage/incident/${id}`)));

    expect(captureSpy).not.toHaveBeenCalled();
    expect(notificationSpy).not.toHaveBeenCalled();

    gen.next();

    expect(notificationSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'De melding kon niet gesplitst worden',
        variant: VARIANT_ERROR,
        type: TYPE_LOCAL,
      })
    );

    expect(gen.next().value).toEqual(call([Sentry, 'captureException'], error));
  });
});
