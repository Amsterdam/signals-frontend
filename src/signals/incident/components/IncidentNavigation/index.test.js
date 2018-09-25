import React from 'react';
import { shallow, mount } from 'enzyme';
import { Wizard, WithWizard } from 'react-albus';

import IncidentNavigation from './index';


// import PreviewComponents from '../../components/IncidentPreview/components/';

describe('<IncidentNavigation />', () => {
  let props;
  let historySpy;
  let context;
  let wrapper;
  let withWizard;


  beforeEach(() => {
    props = {
      valid: false,
      meta: {
        handleSubmit: jest.fn()
      }
    };

    historySpy = {
      next: jest.fn(),
      previous: jest.fn(),
      listen: jest.fn()
    };

    context = {
      wizard: {
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

    withWizard = wrapper.find(WithWizard).last();
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
});
