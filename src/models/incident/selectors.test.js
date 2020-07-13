import { fromJS } from 'immutable';
import makeSelectIncidentModel from './selectors';

describe('makeSelectIncidentModel', () => {
  it('should select the incidentModel', () => {
    const incidentModel = {
      foo: 'bar',
    };

    const mockedState = fromJS({
      incidentModel,
    });
    expect(makeSelectIncidentModel(mockedState)).toEqual(incidentModel);
  });
});
