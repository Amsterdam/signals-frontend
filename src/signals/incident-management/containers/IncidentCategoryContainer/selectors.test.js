import { fromJS } from 'immutable';
import { selectIncidentCategoryContainerDomain } from './selectors';

describe('selectIncidentCategoryContainerDomain', () => {
  it('should select the incidentcategory state', () => {
    const incidentCategoryContainer = fromJS({});
    const mockedState = fromJS({
      incidentCategoryContainer,
    });
    expect(selectIncidentCategoryContainerDomain(mockedState)).toEqual(incidentCategoryContainer);
  });
});
