import React from 'react';
import { shallow } from 'enzyme';

import MapInput from './index';

describe('<MapInput />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      name: 'name',
      display: 'display',
      handler: jest.fn().mockImplementation(() => ({
        value: { id: 5, stadsdeel: 'A', buurt_code: 'A00c', address: { postcode: '1012BL', huisletter: 'B', huisnummer: '84', woonplaats: 'Amsterdam', openbare_ruimte: 'Geldersekade', huisnummer_toevoeging: '' }, address_text: 'Geldersekade 84B- 1012BL Amsterdam', geometrie: { type: 'Point', coordinates: [52.374231891648414, 4.901061058044434] }, extra_properties: null }
      }))
    };

    const MapInputRender = MapInput(props);
    wrapper = shallow(
      <MapInputRender {...props} />
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render correctly', () => {
    expect(wrapper).not.toBeNull();
    expect(wrapper).toMatchSnapshot();
  });
});

