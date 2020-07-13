import React from 'react';
import { shallow } from 'enzyme';

import Anchor from '.';

describe('Definition component <Anchor />', () => {
  let wrapper;

  describe('rendering', () => {
    it('should render with text and text correctly', () => {
      wrapper = shallow(<Anchor href="http://amsterdam.nl">Dit is een link naar amsterdam</Anchor>);

      expect(wrapper).toMatchSnapshot();
    });

    it('should render with text and text and target correctly', () => {
      wrapper = shallow(<Anchor href="http://amsterdam.nl" target="_blank">Dit is een link naar amsterdam</Anchor>);

      expect(wrapper).toMatchSnapshot();
    });
  });
});
