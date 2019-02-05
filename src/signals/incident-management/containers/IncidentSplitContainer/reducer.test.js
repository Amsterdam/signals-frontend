import { fromJS } from 'immutable';
import incidentSplitContainerReducer from './reducer';

describe('incidentSplitContainerReducer', () => {
  it('returns the initial state', () => {
    expect(incidentSplitContainerReducer(undefined, {})).toEqual(fromJS({}));
  });
});
