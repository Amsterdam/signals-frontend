import { testActionCreator } from 'test/utils';

import {
  fetchDefaultTexts,
} from './actions';
import {
  FETCH_DEFAULT_TEXTS,
} from './constants';

describe('DefaultTextsAdmin actions', () => {
  it('should dispatch defaultAction action', () => {
    const payload = {};
    testActionCreator(fetchDefaultTexts, FETCH_DEFAULT_TEXTS, payload);
  });
});
