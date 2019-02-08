import { fromJS } from 'immutable';
import makeSelectIncidentDetailPage, { makeSelectIncidentNotesList, selectRefresh } from './selectors';


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

describe('makeSelectIncidentNotesList', () => {
  const selector = makeSelectIncidentNotesList();
  it('should select the incidentDetailPage', () => {
    const incidentDetailPage = {
      incidentNotesList: [1, 2]
    };

    const mockedState = fromJS({
      incidentDetailPage
    });
    expect(selector(mockedState)).toEqual(incidentDetailPage.incidentNotesList);
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
