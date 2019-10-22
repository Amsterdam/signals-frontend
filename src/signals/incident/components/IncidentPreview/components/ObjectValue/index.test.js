import React from 'react';
import { shallow } from 'enzyme';

import ObjectValue from './index';
describe('Preview component <ObjectValue />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      <ObjectValue
        label="Urgentie"
        value={{
          id: 'normal',
          label: 'Normaal',
        }}
      />
    );
  });

  it('should render object value correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
