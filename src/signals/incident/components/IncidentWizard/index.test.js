import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';

import IncidentWizard from './index';

jest.mock('react-albus');
jest.mock('../IncidentForm', () => 'IncidentForm');
jest.mock('../IncidentPreview', () => 'IncidentPreview');

describe('<IncidentWizard />', () => {
  let props;

  beforeEach(() => {
    props = {
      wizardDefinition: {
        step1: {
          form: {}
        },
        step2: {
          form: {}
        },
        step3: {
          form: {},
          preview: {}
        },
        step4: {}
      },
      getClassification: jest.fn(),
      updateIncident: jest.fn(),
      createIncident: jest.fn(),
      incidentContainer: {},
      isAuthenticated: false
    };
  });

  it('expect to render correctly', () => {
    const wrapper = mount(
      <MemoryRouter
        initialEntries={[{
          pathName: 'incident/step1',
          key: 'wizard'
        }]}
      >
        <IncidentWizard {...props} />
      </MemoryRouter>);

    // expect(wrapper.find('Route')).toBe();
    expect(wrapper).toMatchSnapshot();
  });
});
