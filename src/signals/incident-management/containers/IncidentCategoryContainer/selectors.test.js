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

// describe('makeSelectUserName', () => {
//   const userNameSelector = makeSelectUserName();
//   it('should select the current user', () => {
//     const username = 'loggedInUser';
//     const mockedState = fromJS({
//       global: {
//         userName: username,
//       },
//     });
//     expect(userNameSelector(mockedState)).toEqual(username);
//   });
// });
