import { testActionCreator } from 'test/utils';

import * as constants from '../constants';
import * as actions from '../actions';

describe('signals/incident-management/actions', () => {
  it('should dispatch filterSaved action', () => {
    const foo = 'bar';
    const payload = { foo };

    testActionCreator(actions.filterSaved, constants.SAVE_FILTER, payload);
  });

  it('should dispatch filterSaveFailed action', () => {
    const foo = 'bar';
    const payload = { foo };

    testActionCreator(actions.filterSaveFailed, constants.SAVE_FILTER_FAILED, payload);
  });

  it('should dispatch filterSaveSuccess action', () => {
    const foo = 'bar';
    const payload = { foo };

    testActionCreator(actions.filterSaveSuccess, constants.SAVE_FILTER_SUCCESS, payload);
  });

  it('should dispatch filterUpdated action', () => {
    const foo = 'bar';
    const payload = { foo };

    testActionCreator(actions.filterUpdated, constants.UPDATE_FILTER, payload);
  });

  it('should dispatch filterUpdatedSuccess action', () => {
    const foo = 'bar';
    const payload = { foo };

    testActionCreator(actions.filterUpdatedSuccess, constants.UPDATE_FILTER_SUCCESS, payload);
  });

  it('should dispatch filterUpdatedFailed action', () => {
    const foo = 'bar';
    const payload = { foo };

    testActionCreator(actions.filterUpdatedFailed, constants.UPDATE_FILTER_FAILED, payload);
  });

  it('should dispatch filterCleared action', () => {
    testActionCreator(actions.filterCleared, constants.CLEAR_FILTER, {});
  });
});
