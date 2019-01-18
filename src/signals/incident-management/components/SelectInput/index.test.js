import React from 'react';
import { shallow } from 'enzyme';

import SelectInput from './index';

describe('<SelectInput />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      name: 'name',
      display: 'display',
      handler: jest.fn(),
      values: [
        { key: '', value: 'none', slug: '' },
        { key: '1', value: 'item1', slug: 'item-1' },
        { key: '2', value: 'item2', slug: 'item-2' }
      ],
      multiple: false,
      emptyOptionText: 'all items',
      size: 4
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render correctly', () => {
    const SelectInputRender = SelectInput(props);
    wrapper = shallow(
      <SelectInputRender {...props} />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with multiple select', () => {
    props.multiple = true;
    const SelectInputRender = SelectInput(props);
    wrapper = shallow(
      <SelectInputRender {...props} />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with empty option select', () => {
    props.emptyOptionText = undefined;
    const SelectInputRender = SelectInput(props);
    wrapper = shallow(
      <SelectInputRender {...props} />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with using slugs', () => {
    props.useSlug = true;
    const SelectInputRender = SelectInput(props);
    wrapper = shallow(
      <SelectInputRender {...props} />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with list size smaller than number of values', () => {
    props.size = 2;
    const SelectInputRender = SelectInput(props);
    wrapper = shallow(
      <SelectInputRender {...props} />
    );

    expect(wrapper).toMatchSnapshot();
  });
});
