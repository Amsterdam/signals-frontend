import React from 'react';
import { shallow } from 'enzyme';

import { login } from 'shared/services/auth/auth';
import LoginPage from './index';
import './style.scss';

jest.mock('shared/services/auth/auth');

describe('<LoginPage />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<LoginPage />);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should login on datapunt when Inloggen button is clicked', () => {
    wrapper.find('button').at(0).simulate('click');
    expect(login).toHaveBeenCalledWith('datapunt');
  });

  it('should login on datapunt when Inloggen ADW button is clicked', () => {
    wrapper.find('button').at(1).simulate('click');
    expect(login).toHaveBeenCalledWith('grip');
  });
});
