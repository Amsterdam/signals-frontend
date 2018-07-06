import { fromJS } from 'immutable';

import {
  selectHome,
} from './selectors';

describe('selectHome', () => {
  it('should select the home state', () => {
    const homeState = fromJS({
    });
    const mockedState = fromJS({
      home: homeState,
    });
    expect(selectHome(mockedState)).toEqual(homeState);
  });
});

