import React from 'react';
import { shallow } from 'enzyme';

import SelectInput from './index';

describe('<SelectInput />', () => {
  let renderedComponent;
  let props;

  beforeEach(() => {
    props = {
      name: 'name',
      display: 'display',
      handler: jest.fn(),
      values: [{ key: '1', value: 'item1' }, { key: '2', value: 'item2' }],
      multiple: false,
      emptyOptionText: 'all items',
      size: 4
    };

    const SelectInputRender = SelectInput(props);
    renderedComponent = shallow(
      <SelectInputRender {...props} />
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render correctly', () => {
    expect(renderedComponent).not.toBeNull();
    expect(renderedComponent).toMatchSnapshot();
  });
});

