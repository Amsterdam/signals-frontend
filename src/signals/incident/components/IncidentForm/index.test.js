import React from 'react';
import { shallow } from 'enzyme';

import IncidentForm from './index';

describe('<IncidentForm />', () => {
  let props;

  beforeEach(() => {
    props = {
      fieldConfig: {
        controls: {}
      },
      incidentContainer: {
        incident: {}
      },
      wizard: {

      },
      getClassification: jest.fn(),
      updateIncident: jest.fn(),
      createIncident: jest.fn(),
      isAuthenticated: false
    };
  });

  it('expect to render correctly', () => {
    const wrapper = shallow(
      <IncidentForm {...props} />
    );

    expect(wrapper).toMatchSnapshot();
  });
});
