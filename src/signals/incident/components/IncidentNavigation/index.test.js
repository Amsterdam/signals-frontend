import React from 'react';
import { shallow, mount } from 'enzyme';
import { Wizard, WithWizard } from 'react-albus';

import * as auth from 'shared/services/auth/auth';
import { withAppContext } from 'test/utils';

import IncidentNavigation from '.';

jest.mock('shared/services/auth/auth', () => ({
  __esModule: true,
  ...jest.requireActual('shared/services/auth/auth'),
}));

jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => false);

describe('<IncidentNavigation />', () => {
  let props;
  let historySpy;
  let context;
  let wrapper;
  let withWizard;

  function getComponent() {
    wrapper = mount(
      withAppContext(
        <Wizard history={historySpy}>
          <IncidentNavigation {...props} />
        </Wizard>
      )
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
          incident: {},
        },
        submitting: false,
        wizard: {
          beschrijf: {
            nextButtonLabel: 'Volgende',
            nextButtonClass: 'next-class',
            formAction: 'UPDATE_INCIDENT',
            form: {
              controls: {},
            },
          },
          email: {
            previousButtonLabel: 'Vorige',
            previousButtonClass: 'previous-class',
            nextButtonLabel: 'Volgende',
            nextButtonClass: 'next-class',
            form: {
              controls: {},
            },
          },
          samenvatting: {
            previousButtonLabel: 'Vorige',
            previousButtonClass: 'previous-class',
            nextButtonLabel: 'Volgende',
            nextButtonClass: 'next-class send-button',
            formAction: 'CREATE_INCIDENT',
            form: {
              controls: {},
            },
          },
          bedankt: {
            form: {
              controls: {},
            },
          },
        },
        updateIncident: jest.fn(),
        createIncident: jest.fn(),
        handleSubmit: jest.fn(),
      },
    };

    historySpy = {
      listen: jest.fn(),
    };

    context = {
      wizard: {
        next: jest.fn(),
        previous: jest.fn(),
        step: { id: 'incident/beschrijf' },
      },
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
        hide_navigation_buttons: {
          meta: {
            isVisible: true,
          },
        },
      };
      getComponent();

      context.wizard.step = { id: 'incident/email' };
      const withWizardWrapper = shallow(withWizard.get(0), { context });

      expect(wrapper).toMatchSnapshot();
      expect(withWizardWrapper).toMatchSnapshot();
    });

    it('render correctly button with submitting state', () => {
      props.meta.submitting = true;
      getComponent();

      context.wizard.step = { id: 'incident/beschrijf' };
      const withWizardWrapper = shallow(withWizard.get(0), { context });

      expect(wrapper).toMatchSnapshot();
      expect(withWizardWrapper).toMatchSnapshot();
    });
  });

  describe('events', () => {
    const event = {};

    it('should trigger next when clicking next button', () => {
      getComponent();

      context.wizard.step = { id: 'incident/beschrijf' };
      const withWizardWrapper = shallow(withWizard.get(0), { context });

      withWizardWrapper.find('[data-testid="nextButton"]').simulate('click', event);

      expect(props.meta.handleSubmit).toHaveBeenCalledWith(event, context.wizard.next, 'UPDATE_INCIDENT');
    });

    it('should trigger next when clicking next button without form action', () => {
      getComponent();

      context.wizard.step = { id: 'incident/email' };
      const withWizardWrapper = shallow(withWizard.get(0), { context });

      withWizardWrapper.find('[data-testid="nextButton"]').simulate('click', event);

      expect(props.meta.handleSubmit).toHaveBeenCalledWith(event, context.wizard.next, undefined);
    });

    it('should trigger previous when clicking previous button', () => {
      context.wizard.step = { id: 'incident/email' };
      const withWizardWrapper = shallow(withWizard.get(0), { context });

      withWizardWrapper.find('[data-testid="previousButton"]').simulate('click');

      expect(context.wizard.previous).toHaveBeenCalled();
      expect(props.meta.handleSubmit).not.toHaveBeenCalled();
    });

    it('should trigger create when clicking submit button', () => {
      getComponent();

      context.wizard.step = { id: 'incident/samenvatting' };
      const withWizardWrapper = shallow(withWizard.get(0), { context });

      withWizardWrapper.find('[data-testid="nextButton"]').simulate('click', event);

      expect(props.meta.handleSubmit).toHaveBeenCalledWith(event, context.wizard.next, 'CREATE_INCIDENT');
    });
  });
});
