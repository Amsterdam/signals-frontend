/* eslint-disable react/prop-types */
import React from 'react';
import { shallow } from 'enzyme';

import Concat from '.';

describe('Definition component <Concat />', () => {
  const MockListComponent = ({ items }) => (
    <ul>
      {items.map(item => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
  const MockChildComponent = ({ children }) => <span>{children}</span>;
  const MockComponent = () => <span>text 4</span>;
  let wrapper;

  describe('rendering', () => {
    it('should concat all texts and components of the array into spans', () => {
      wrapper = shallow(
        <Concat
          items={[
            'text 1',
            <MockListComponent items={['text 2']} />,
            <MockChildComponent>text 3</MockChildComponent>,
            <MockComponent />,
          ]}
        />
      );

      expect(wrapper).toMatchSnapshot();
    });
  });
});
