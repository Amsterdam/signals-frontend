import React from 'react';
import { shallow, mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { Step } from 'react-albus';

import IncidentWizard from './index';

jest.mock('../IncidentForm', () => () => 'IncidentForm');
jest.mock('../IncidentPreview', () => () => 'IncidentPreview');
jest.mock('shared/components/LoadingIndicator', () => () => 'LoadingIndicator');

describe('<IncidentWizard />', () => {
  function createComponent(wizardDefinition, loading = false) {
    const props = {
      wizardDefinition,
      getClassification: jest.fn(),
      updateIncident: jest.fn(),
      createIncident: jest.fn(),
      incidentContainer: {
        loading,
      },
      isAuthenticated: false,
    };

    const wrapper = mount(
      <MemoryRouter keyLength={0}>
        <IncidentWizard {...props} />
      </MemoryRouter>
    );

    const step = wrapper.find(Step);
    if (step.length === 0) {
      return wrapper;
    }

    shallow(step.get(0), {
      context: {
        wizard: {},
      },
    });

    return wrapper;
  }

  beforeEach(() => {
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('expect to render form correctly', () => {
    const wrapper = createComponent({
      beschrijf: {
        form: {
          controls: {
            with_definition: {},
          },
        },
      },
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('expect to render form factory correctly', () => {
    const wrapper = createComponent({
      beschrijf: {
        formFactory: () => ({
          controls: {
            with_factory: {},
          },
        }),
      },
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('expect to render preview correctly', () => {
    const wrapper = createComponent({
      samenvatting: {
        preview: {},
      },
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('expect to render loading correctly', () => {
    const wrapper = createComponent({
      samenvatting: {
        preview: {},
      },
    }, true);

    expect(wrapper).toMatchSnapshot();
  });
});
