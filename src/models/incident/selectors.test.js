import { fromJS } from 'immutable';
import makeSelectIncidentModel from './selectors';


describe('makeSelectIncidentModel', () => {
  const selector = makeSelectIncidentModel();
  it('should select the incidentModel', () => {
    const incidentModel = {
      foo: 'bar'
    };

    const mockedState = fromJS({
      incidentModel
    });
    expect(selector(mockedState)).toEqual(incidentModel);
  });
});
