
import { fromJS } from 'immutable';
import incidentDetailPageReducer from './reducer';

describe('incidentDetailPageReducer', () => {
  it('returns the initial state', () => {
    expect(incidentDetailPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
