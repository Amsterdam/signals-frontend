
import { fromJS } from 'immutable';
import incidentContainerReducer from './reducer';

describe('incidentContainerReducer', () => {
  it('returns the initial state', () => {
    expect(incidentContainerReducer(undefined, {})).toEqual(fromJS({}));
  });
});
