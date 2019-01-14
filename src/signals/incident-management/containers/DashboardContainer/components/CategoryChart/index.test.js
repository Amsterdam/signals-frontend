import React from 'react';
import { shallow } from 'enzyme';

import CategoryChart from './index';

describe('<CategoryChart />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      data: [
        { name: 'Overlast op het water', count: 2 },
        { name: 'Overlast van dieren', count: 9 },
        { name: 'Overlast van en door personen en groepen', count: 9 },
        { name: 'Overlast bedrijven en horeca', count: 12 },
        { name: 'Openbaar groen en water', count: 28 },
        { name: 'Overlast in de openbare ruimte', count: 82 },
        { name: 'Overig', count: 88 },
        { name: 'Wegen verkeer straatmeubileir ', count: 126 },
        { name: 'Afval', count: 275 }
      ]
    };

    wrapper = shallow(
      <CategoryChart {...props} />
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
