
import { fromJS } from 'immutable';
import incidentStatusContainerReducer from './reducer';

describe('incidentStatusContainerReducer', () => {
  it('returns the initial state', () => {
    expect(incidentStatusContainerReducer(undefined, {})).toEqual(fromJS({}));
  });
});
