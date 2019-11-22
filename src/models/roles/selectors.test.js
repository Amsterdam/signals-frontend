import { fromJS } from 'immutable';
import makeSelectRolesModel from './selectors';
import { initialState } from './reducer';


describe('makeSelectRolesModel', () => {
  it('should select the initial state', () => {
    const mockedState = fromJS({});
    expect(makeSelectRolesModel(mockedState)).toEqual(initialState.toJS());
  });

  it('should select the roles', () => {
    const roles = {
      list: [{ id: 42 }],
    };

    const mockedState = fromJS({
      roles,
    });
    expect(makeSelectRolesModel(mockedState)).toEqual(roles);
  });
});
