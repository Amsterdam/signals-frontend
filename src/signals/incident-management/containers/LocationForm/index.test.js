import React from 'react';
import { shallow } from 'enzyme';

import { PATCH_INCIDENT } from 'models/incident/constants';

import { LocationForm, mapDispatchToProps } from './index';

jest.mock('./components/Form', () => () => 'Form');

describe('<LocationForm />', () => {
  let props;

  beforeEach(() => {
    props = {
      incidentModel: {
        incident: {
          id: 42,
          location: { foo: 'bar' }
        },
        patching: {
          location: false
        }
      },
      onPatchIncident: jest.fn()
    };
  });

  it('should render correctly', () => {
    const wrapper = shallow(
      <LocationForm {...props} />
    );

    expect(wrapper).toMatchSnapshot();
  });


  describe('mapDispatchToProps', () => {
    const dispatch = jest.fn();

    it('should close the error', () => {
      mapDispatchToProps(dispatch).onPatchIncident();
      expect(dispatch).toHaveBeenCalledWith({ type: PATCH_INCIDENT });
    });
  });
});
