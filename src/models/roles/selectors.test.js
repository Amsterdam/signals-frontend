import { fromJS } from 'immutable';
import makeSelectRolesModel from './selectors';


describe('makeSelectRolesModel', () => {
  const selector = makeSelectRolesModel();
  it('should select the roles', () => {
    const roles = {
      list: [],
    };

    const mockedState = fromJS({
      roles,
    });
    expect(selector(mockedState)).toEqual(roles);
  });
});
