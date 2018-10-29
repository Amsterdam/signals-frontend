import { fromJS } from 'immutable';
import makeSelectIncidentCategoryContainer from './selectors';

describe('makeSelectIncidentCategoryContainer', () => {
  it('should select the category container', () => {
    const selector = makeSelectIncidentCategoryContainer();
    const incidentCategoryContainer = {
      subcategoryList: []
    };
    const mockedState = fromJS({
      incidentCategoryContainer
    });

    expect(selector(mockedState)).toEqual(incidentCategoryContainer);
  });
});
