import React from 'react';
import { shallow, mount } from 'enzyme';

import { Wizard, WithWizard } from 'react-albus';

import PreviewComponents from '../../components/IncidentPreview/components/';
import IncidentPreview from './index';

describe('<IncidentPreview />', () => {
  let props;

  beforeEach(() => {
    props = {
      incidentContainer: {
        incident: {
          phone: '0666 666 666',
          email: 'devil@hell.com'
        }
      },
      preview: {
        step1: {
          phone: {
            label: 'Uw (mobiele) telefoon',
            render: PreviewComponents.PlainText
          }
        },
        step2: {
          email: {
            label: 'Uw e-mailadres',
            render: PreviewComponents.PlainText
          }
        }
      }
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('expect to render correctly', () => {
    const wrapper = shallow(
      <IncidentPreview {...props} />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('should trigger new page when clicking button', () => {
    const historySpy = {
      push: jest.fn(),
      listen: jest.fn()
    };

    const wrapper = mount(
      <Wizard history={historySpy}>
        <IncidentPreview {...props} />
      </Wizard>
    );

    const withWizard = wrapper.find(WithWizard).last();

    shallow(withWizard.get(0), { context: {
      wizard: {}
    } });

    withWizard.find('button').simulate('click');

    expect(historySpy.push).toHaveBeenCalledWith('/incident/step2');
  });
});
