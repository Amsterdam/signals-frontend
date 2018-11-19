import React from 'react';
import { shallow, mount } from 'enzyme';
import { Wizard, WithWizard } from 'react-albus';

import IncidentNavigation from './index';

describe('<IncidentNavigation />', () => {
  let props;
  let historySpy;
  let context;
  let wrapper;
  let withWizard;

  function getComponent() {
    wrapper = mount(
      <Wizard history={historySpy}>
        <IncidentNavigation {...props} />
      </Wizard>
    );

    withWizard = wrapper.find(WithWizard);
  }

  beforeEach(() => {
    props = {
      valid: true,
      controls: {},
      value: {},
      meta: {
        incidentContainer: {
          incident: {}
        },
        isAuthenticated: false,
        wizard: {
          beschrijf: {
            nextButtonLabel: 'Volgende',
            nextButtonClass: 'next-class',
            formAction: 'UPDATE_INCIDENT',
            form: {
              controls: {}
            }
          },
          email: {
            previousButtonLabel: 'Vorige',
            previousButtonClass: 'previous-class',
            nextButtonLabel: 'Volgende',
            nextButtonClass: 'next-class',
            formAction: 'UPDATE_INCIDENT',
            form: {
              controls: {}
            }
          },
          samenvatting: {
            previousButtonLabel: 'Vorige',
            previousButtonClass: 'previous-class',
            nextButtonLabel: 'Volgende',
            nextButtonClass: 'next-class send-button',
            formAction: 'CREATE_INCIDENT',
            form: {
              controls: {}
            }
          },
          bedankt: {
            form: {
              controls: {}
            }
          }
        },
        updateIncident: jest.fn(),
        createIncident: jest.fn(),
        handleSubmit: jest.fn()
      },
    };

    historySpy = {
      listen: jest.fn()
    };

    context = {
      wizard: {
        next: jest.fn(),
        previous: jest.fn(),
        step: { id: 'incident/beschrijf' }
      }
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('rendering', () => {
    it('render correctly first step with one button: next', () => {
      getComponent();

      context.wizard.step = { id: 'incident/beschrijf' };
      const withWizardWrapper = shallow(withWizard.get(0), { context });

      expect(wrapper).toMatchSnapshot();
      expect(withWizardWrapper).toMatchSnapshot();
    });

    it('render correctly second step with two buttons: previous and next', () => {
      getComponent();

      context.wizard.step = { id: 'incident/email' };
      const withWizardWrapper = shallow(withWizard.get(0), { context });

      expect(wrapper).toMatchSnapshot();
      expect(withWizardWrapper).toMatchSnapshot();
    });

    it('render correctly last step with two buttons: previous and submit', () => {
      getComponent();

      context.wizard.step = { id: 'incident/samenvatting' };
      const withWizardWrapper = shallow(withWizard.get(0), { context });

      expect(wrapper).toMatchSnapshot();
      expect(withWizardWrapper).toMatchSnapshot();
    });

    it('render correctly last step with no button', () => {
      getComponent();

      context.wizard.step = { id: 'incident/bedankt' };
      const withWizardWrapper = shallow(withWizard.get(0), { context });

      expect(wrapper).toMatchSnapshot();
      expect(withWizardWrapper).toMatchSnapshot();
    });

    it('render correctly second step when submit button is suppressed with no buttons', () => {
      props.controls = {
        navigation_submit_button: {
          meta: {
            isVisible: false
          }
        }
      };
      getComponent();

      context.wizard.step = { id: 'incident/email' };
      const withWizardWrapper = shallow(withWizard.get(0), { context });

      expect(wrapper).toMatchSnapshot();
      expect(withWizardWrapper).toMatchSnapshot();
    });
  });

  describe('events', () => {
    it('should trigger next when clicking next button', () => {
      getComponent();

      context.wizard.step = { id: 'incident/beschrijf' };
      const withWizardWrapper = shallow(withWizard.get(0), { context });

      withWizardWrapper.find('button').simulate('click');

      expect(context.wizard.next).toHaveBeenCalled();
      expect(props.meta.handleSubmit).toHaveBeenCalled();
      expect(props.meta.updateIncident).toHaveBeenCalled();
      expect(props.meta.createIncident).not.toHaveBeenCalled();
    });

    it('should trigger previous when clicking previous button', () => {
      context.wizard.step = { id: 'incident/email' };
      const withWizardWrapper = shallow(withWizard.get(0), { context });

      withWizardWrapper.find('button').first().simulate('click');

      expect(context.wizard.previous).toHaveBeenCalled();
      expect(props.meta.handleSubmit).not.toHaveBeenCalled();
      expect(props.meta.updateIncident).not.toHaveBeenCalled();
      expect(props.meta.createIncident).not.toHaveBeenCalled();
    });

    it('should trigger create when clicking submit button', () => {
      getComponent();

      context.wizard.step = { id: 'incident/samenvatting' };
      const withWizardWrapper = shallow(withWizard.get(0), { context });

      withWizardWrapper.find('button').last().simulate('click');

      expect(context.wizard.next).toHaveBeenCalled();
      expect(props.meta.handleSubmit).toHaveBeenCalled();
      expect(props.meta.updateIncident).not.toHaveBeenCalled();
      expect(props.meta.createIncident).toHaveBeenCalled();
    });

    it('should not trigger next when valid is false and clicking next button', () => {
      getComponent();

      props.valid = false;

      wrapper = mount(
        <Wizard history={historySpy}>
          <IncidentNavigation {...props} />
        </Wizard>
      );

      withWizard = wrapper.find(WithWizard);

      context.wizard.step = { id: 'incident/samenvatting' };
      const withWizardWrapper = shallow(withWizard.get(0), { context });

      withWizardWrapper.find('button').last().simulate('click');

      expect(context.wizard.next).not.toHaveBeenCalled();
      expect(props.meta.handleSubmit).not.toHaveBeenCalled();
    });
  });
});
