import React from 'react';
import { shallow } from 'enzyme';
import { FieldGroup } from 'react-reactive-form';

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

  it.only('should render the FieldGroup', () => {
    expect(renderedComponent.find(FieldGroup)).toHaveLength(1);
    const renderedFormGroup = (renderedComponent.find(FieldGroup).shallow().dive());
    expect(renderedFormGroup).toMatchSnapshot();
  });

  // it('should render 2 buttons', () => {
  //   console.log(renderedComponent.debug());
  //   expect(renderedComponent.find('button').length).toEqual(2);
  // });
});
