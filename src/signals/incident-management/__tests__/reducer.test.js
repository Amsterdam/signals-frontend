import { fromJS } from 'immutable';
import reducer, { initialState } from '../reducer';
import {
  SAVE_FILTER_FAILED,
  SAVE_FILTER_SUCCESS,
  CLEAR_FILTER,
  UPDATE_FILTER_SUCCESS,
  UPDATE_FILTER_FAILED,
} from '../constants';

const errorMessage = 'Something went horribly wrong';
const activeFilter = {
  maincategory_slug: ['i', 'o'],
  name: 'Foo Bar',
};

describe('signals/incident-management/reducer', () => {
  it('should return the initial state', () => {
    const defaultAction = {
      type: 'SOME_UNSUPPORTED_TYPE',
    };

    expect(reducer(initialState, defaultAction)).toEqual(initialState);
  });

  it('should handle SAVE_FILTER_FAILED', () => {
    const filterSaveFailed = {
      type: SAVE_FILTER_FAILED,
      payload: errorMessage,
    };

    const expected = fromJS({})
      .set('loading', false)
      .set('error', true)
      .set('errorMessage', errorMessage)
      .set('activeFilter', fromJS({}));

    expect(reducer(initialState, filterSaveFailed)).toEqual(expected);
  });

  it('should handle SAVE_FILTER_SUCCESS', () => {
    const filterSaveSuccess = {
      type: SAVE_FILTER_SUCCESS,
      payload: activeFilter,
    };

    const expected = fromJS({})
      .set('loading', false)
      .set('error', false)
      .set('errorMessage', '')
      .set('activeFilter', fromJS(activeFilter));

    expect(reducer(initialState, filterSaveSuccess)).toEqual(expected);
  });

  it('should handle CLEAR_FILTER', () => {
    const filterCleared = {
      type: CLEAR_FILTER,
      payload: activeFilter,
    };

    const expected = fromJS({})
      .set('loading', false)
      .set('error', false)
      .set('errorMessage', '')
      .set('activeFilter', fromJS(activeFilter));

    expect(reducer(initialState, filterCleared)).toEqual(expected);
  });

  it('should handle UPDATE_FILTER_SUCCESS', () => {
    const filterUpdatedSuccess = {
      type: UPDATE_FILTER_SUCCESS,
      payload: activeFilter,
    };

    const expected = fromJS({})
      .set('loading', false)
      .set('error', false)
      .set('errorMessage', '')
      .set('activeFilter', fromJS(activeFilter));

    expect(reducer(initialState, filterUpdatedSuccess)).toEqual(expected);
  });

  it('should handle UPDATE_FILTER_FAILED', () => {
    const filterUpdatedFailed = {
      type: UPDATE_FILTER_FAILED,
      payload: errorMessage,
    };

    const expected = fromJS({})
      .set('loading', false)
      .set('error', true)
      .set('errorMessage', errorMessage)
      .set('activeFilter', fromJS({}));

    expect(reducer(initialState, filterUpdatedFailed)).toEqual(expected);
  });
});
