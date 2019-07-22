import makeSelectIncidentSplitContainer from './selectors';


describe('makeSelectIncidentDetail', () => {
  const selector = makeSelectIncidentSplitContainer();
  it('should select the incidentSplitContainer', () => {
    const incidentSplitContainer = {
      foo: 'bar'
    };

    const mockedState = {
      incidentSplitContainer
    };
    expect(selector(mockedState)).toEqual(incidentSplitContainer);
  });
});
