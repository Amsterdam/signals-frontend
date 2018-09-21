import React from 'react';
import { shallow } from 'enzyme';

import IncidentWizard from './index';

// import IncidentForm from '../IncidentForm';
// import IncidentPreview from '../IncidentPreview';

jest.mock('../IncidentForm', () => 'IncidentForm');
jest.mock('../IncidentPreview', () => 'IncidentPreview');

describe('<IncidentWizard />', () => {
  let props;

  beforeEach(() => {
    props = {
      getClassification: jest.fn(),
      updateIncident: jest.fn(),
      createIncident: jest.fn(),
      incidentContainer: {},
      isAuthenticated: false
    };
  });

  it('expect to render correctly', () => {
    const wrapper = shallow(<IncidentWizard {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
