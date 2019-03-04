import { fromJS } from 'immutable';
import makeSelectIncidentSplitContainer from './selectors';


describe('makeSelectIncidentDetailPage', () => {
  const selector = makeSelectIncidentSplitContainer();
  it('should select the incidentSplitContainer', () => {
    const incidentSplitContainer = {
      foo: 'bar'
    };

    const mockedState = fromJS({
      incidentSplitContainer
    });
    expect(selector(mockedState)).toEqual(incidentSplitContainer);
  });
});
