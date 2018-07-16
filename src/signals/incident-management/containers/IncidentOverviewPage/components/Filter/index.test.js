import React from 'react';
import { shallow } from 'enzyme';

import Filter from './index';

describe('<Filter />', () => {
  let renderedComponent;
  let props;

  beforeEach(() => {
    props = {
      filterIncidents: jest.fn()
    };

    renderedComponent = shallow(
      <Filter {...props} />
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render correctly', () => {
    expect(renderedComponent).toMatchSnapshot();
  });

  // it('should render 2 buttons', () => {
  //   console.log(renderedComponent.debug());
  //   expect(renderedComponent.find('button').length).toEqual(2);
  // });
});
