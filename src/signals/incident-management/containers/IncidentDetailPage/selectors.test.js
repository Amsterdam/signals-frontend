import { fromJS } from 'immutable';
import makeSelectIncidentDetailPage, { selectRefresh } from './selectors';


describe('makeSelectIncidentDetailPage', () => {
  const selector = makeSelectIncidentDetailPage();
  it('should select the incidentDetailPage', () => {
    const incidentDetailPage = {
      foo: 'bar'
    };

    const mockedState = fromJS({
      incidentDetailPage
    });
    expect(selector(mockedState)).toEqual(incidentDetailPage);
  });
});

describe('selectRefresh', () => {
  const selector = selectRefresh('2');
  it('should select the selectRefresh', () => {
    const incidentDetailPage = {
      id: '2'
    };

    const mockedState = fromJS({
      incidentDetailPage
    });
    expect(selector(mockedState)).toEqual(false);
  });
});
