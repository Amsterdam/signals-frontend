import React from 'react';
import { mount } from 'enzyme';

import KtoForm from './index';
import formatConditionalForm from '../../../../services/format-conditional-form/';

jest.mock('../../../../services/format-conditional-form/');

const mockForm = {
  controls: {
    tevreden: {
      meta: {
        label: 'Waarom bent u tevreden?',
        subtitle: 'Eén antwoord mogelijk, kies de belangrijkste reden.',
        ifAllOf: {
          yesNo: 'ja'
        },
        values: {}
      }
    },
    tevreden_anders: {
      meta: {
        ifAllOf: {
          yesNo: 'ja',
          tevreden: 'Anders, namelijk...'
        }
      }
    },
    text_extra: {
      meta: {
        label: 'Wilt u verder nog iets vermelden of toelichten?'
      }
    },
    allows_contact: {
      meta: {
        label: 'Mogen wij conact met u opnemen naar aanleiding vanuw feedback?'
      }
    }
  }
};

describe('<KtoForm />', () => {
  let props;
  let wrapper;
  let instance;
  let spy;

  beforeEach(() => {
    props = {
      fieldConfig: {
        controls: {}
      },
      ktoContainer: {
        form: {}
      },
      wizard: {},
      onUpdateKto: jest.fn(),
      onStoreKto: jest.fn()
    };

    formatConditionalForm.mockImplementation(() => mockForm);
    jest.useFakeTimers();

    wrapper = mount(
      <KtoForm {...props} />
    );

    instance = wrapper.instance();

    spy = jest.spyOn(instance, 'setValues');
  });

  afterEach(() => {
    jest.runAllTimers();
    jest.resetAllMocks();
  });

  describe('rendering', () => {
    it('expect to render yes form correctly', () => {
      wrapper.setProps({
        ktoContainer: {
          form: {
            yesNo: 'ja'
          }
        }
      });
      expect(wrapper).toMatchSnapshot();
    });

    it('expect to render no form correctly', () => {
      wrapper.setProps({
        ktoContainer: {
          form: {
            yesNo: 'nee'
          }
        }
      });
      expect(wrapper).toMatchSnapshot();
    });

    it('expect to render correctly when form vars have changed', () => {
      const ktoContainer = {
        form: {
          text_extra: 'weer andere tekst'
        }
      };
      wrapper.setProps({ ktoContainer });

      expect(wrapper).toMatchSnapshot();
      expect(spy).toHaveBeenCalledWith(ktoContainer.form);
    });
  });

  describe('events', () => {
    it('submit should trigger blur', () => {
      const event = { preventDefault: jest.fn() };
      wrapper.find('form').simulate('submit', event);

      expect(event.preventDefault).toHaveBeenCalled();
    });
  });
});
