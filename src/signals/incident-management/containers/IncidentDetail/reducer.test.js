import {
  CLOSE_ALL,
  EDIT,
  PATCH_START,
  PATCH_SUCCESS,
  PREVIEW,
  RESET,
  SET_ATTACHMENTS,
  SET_CHILDREN,
  SET_DEFAULT_TEXTS,
  SET_ERROR,
  SET_HISTORY,
  SET_INCIDENT,
} from './constants';
import reducer, { initialState, closedState } from './reducer';

describe('signals/incident-management/containers/IncidentDetail/reducer', () => {
  const state = {
    ...initialState,
    foo: 'bar',
  };

  it('should return the state', () => {
    expect(reducer(state, {})).toEqual(state);
  });

  it('should handle RESET', () => {
    expect(reducer(state, { type: RESET })).toEqual(initialState);
  });

  it('should handle CLOSE_ALL', () => {
    expect(reducer(state, { type: CLOSE_ALL })).toEqual({ ...state, ...closedState });
  });

  it('should handle SET_ERROR', () => {
    const error = new Error('Whoopsie!');
    expect(reducer(state, { type: SET_ERROR, payload: error })).toEqual({ ...state, error });
  });

  it('should handle SET_ATTACHMENTS', () => {
    const attachments = [{ id: 123 }, { id: 456 }];
    expect(reducer(state, { type: SET_ATTACHMENTS, payload: attachments })).toEqual({ ...state, attachments });
  });

  it('should handle SET_CHILDREN', () => {
    const children = [{ foo: 'bar' }, { bar: 'baz' }];
    expect(reducer(state, { type: SET_CHILDREN, payload: children })).toEqual({ ...state, children });
  });

  it('should handle SET_DEFAULT_TEXTS', () => {
    const defaultTexts = ['foo', 'bar', 'baz'];
    expect(reducer(state, { type: SET_DEFAULT_TEXTS, payload: defaultTexts })).toEqual({ ...state, defaultTexts });
  });

  it('should handle SET_HISTORY', () => {
    const history = ['zork', 'bar', 'baz'];
    expect(reducer(state, { type: SET_HISTORY, payload: history })).toEqual({ ...state, history });
  });

  it('should handle SET_INCIDENT', () => {
    const children = [{ foo: 'bar' }, { bar: 'baz' }];
    const incident = { id: 999, text: 'Hic sunt dracones' };

    const intermediateState = {
      ...state,
      incident: { status: 'o', text: 'old' },
      children,
    };

    expect(reducer(intermediateState, { type: SET_INCIDENT, payload: incident })).toEqual({
      ...intermediateState,
      incident,
      children,
    });
  });

  it('should handle PATCH_START', () => {
    const patching = 'status';
    expect(reducer(state, { type: PATCH_START, payload: patching })).toEqual({ ...state, patching });
  });

  it('should handle PATCH_SUCCESS', () => {
    const intermediateState = {
      ...state,
      patching: 'zork',
    };
    expect(reducer(intermediateState, { type: PATCH_SUCCESS })).toEqual({ ...intermediateState, patching: undefined });
  });

  it('should handle PREVIEW', () => {
    const payload = {
      preview: 'attachment',
      attachmentHref: 'foo',
    };
    expect(reducer(state, { type: PREVIEW, payload })).toEqual({ ...state, edit: undefined, ...payload });
  });

  it('should handle EDIT', () => {
    const payload = {
      edit: 'location',
      foo: 'bar',
    };
    expect(reducer(state, { type: EDIT, payload })).toEqual({ ...state, preview: undefined, ...payload });
  });
});
