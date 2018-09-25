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

  beforeEach(() => {
    props = {
      valid: true,
      meta: {
        handleSubmit: jest.fn()
      }
    };

    historySpy = {
      listen: jest.fn()
    };

    context = {
      wizard: {
        next: jest.fn(),
        previous: jest.fn(),
        steps: [
          { id: 'incident/beschrijf' },
          { id: 'incident/email' },
          { id: 'incident/samenvatting' },
          { id: 'incident/bedankt' }
        ]
      }
    };

    wrapper = mount(
      <Wizard history={historySpy}>
        <IncidentNavigation {...props} />
      </Wizard>
    );

    withWizard = wrapper.find(WithWizard);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('rendering', () => {
    it('render correctly first step with one button: next', () => {
      context.wizard.step = { id: 'incident/beschrijf' };
      const withWizardWrapper = shallow(withWizard.get(0), { context });

      expect(wrapper).toMatchSnapshot();
      expect(withWizardWrapper).toMatchSnapshot();
    });

    it('render correctly first step with two buttons: previous and next', () => {
      context.wizard.step = { id: 'incident/email' };
      const withWizardWrapper = shallow(withWizard.get(0), { context });

      expect(wrapper).toMatchSnapshot();
      expect(withWizardWrapper).toMatchSnapshot();
    });

    it('render correctly second step with two buttons: previous and next', () => {
      context.wizard.step = { id: 'incident/email' };
      const withWizardWrapper = shallow(withWizard.get(0), { context });

      expect(wrapper).toMatchSnapshot();
      expect(withWizardWrapper).toMatchSnapshot();
    });

    it('render correctly last step with two buttons: previous and submit', () => {
      context.wizard.step = { id: 'incident/samenvatting' };
      const withWizardWrapper = shallow(withWizard.get(0), { context });

      expect(wrapper).toMatchSnapshot();
      expect(withWizardWrapper).toMatchSnapshot();
    });

    it('render correctly last step with one button: previous', () => {
      context.wizard.step = { id: 'incident/bedankt' };
      const withWizardWrapper = shallow(withWizard.get(0), { context });

      expect(wrapper).toMatchSnapshot();
      expect(withWizardWrapper).toMatchSnapshot();
    });
  });

  describe('events', () => {
    it('should trigger next when clicking next button', () => {
      context.wizard.step = { id: 'incident/beschrijf' };
      const withWizardWrapper = shallow(withWizard.get(0), { context });

      withWizardWrapper.find('button').simulate('click');

      expect(context.wizard.next).toHaveBeenCalled();
      expect(props.meta.handleSubmit).toHaveBeenCalled();
    });

    it('should trigger previous when clicking next button', () => {
      context.wizard.step = { id: 'incident/email' };
      const withWizardWrapper = shallow(withWizard.get(0), { context });

      withWizardWrapper.find('button').first().simulate('click');

      expect(context.wizard.previous).toHaveBeenCalled();
      expect(props.meta.handleSubmit).not.toHaveBeenCalled();
    });

    it('should not trigger next when valid is false and clicking next button', () => {
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
