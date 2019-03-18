import { testActionCreator } from 'test/utils';

import {
  defaultAction,
} from './actions';
import {
  DEFAULT_ACTION,
} from './constants';

describe('KtoContainer actions', () => {
  it('should dispatch defaultAction action', () => {
    const payload = {};
    testActionCreator(defaultAction, DEFAULT_ACTION, payload);
  });
});
