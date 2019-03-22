import React from 'react';
import { shallow } from 'enzyme';

import CopyFileInput from './index';

describe('<CopyFileInput />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      name: 'name',
      display: 'display',
      handler: jest.fn(),
      values: [
        { key: '', value: 'none' },
        { key: '1', value: 'item1' },
        { key: '2', value: 'item2' }
      ]
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render correctly', () => {
    const CopyFileInputRender = CopyFileInput(props);
    wrapper = shallow(
      <CopyFileInputRender {...props} />
    );

    expect(wrapper).toMatchSnapshot();
  });
});
