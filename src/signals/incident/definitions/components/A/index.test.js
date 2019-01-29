import React from 'react';
import { shallow } from 'enzyme';

import A from './index';

describe('Definition component <A />', () => {
  let wrapper;

  describe('rendering', () => {
    it('should render with text and text correctly', () => {
      wrapper = shallow(<A href="http://amsterdam.nl">Dit is een link naar amsterdam</A>);

      expect(wrapper).toMatchSnapshot();
    });

    it('should render with text and text and target correctly', () => {
      wrapper = shallow(<A href="http://amsterdam.nl" target="_blank">Dit is een link naar amsterdam</A>);

      expect(wrapper).toMatchSnapshot();
    });
  });
});
