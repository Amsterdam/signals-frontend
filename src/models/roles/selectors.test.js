import { fromJS } from 'immutable';
import { rolesModelSelector } from './selectors';
import { initialState } from './reducer';


describe('rolesModelSelector', () => {
  it('should select the initial state', () => {
    const mockedState = fromJS({});
    expect(rolesModelSelector(mockedState)).toEqual(initialState.toJS());
  });

  it('should select the roles', () => {
    const roles = {
      list: [{ id: 42 }],
    };

    const mockedState = fromJS({
      roles,
    });
    expect(rolesModelSelector(mockedState)).toEqual(roles);
  });
});
