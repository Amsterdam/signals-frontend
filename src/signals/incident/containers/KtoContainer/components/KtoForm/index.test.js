import React from 'react';
import { mount } from 'enzyme';

import KtoForm, { andersOptionText } from './index';
import formatConditionalForm from '../../../../services/format-conditional-form/';

jest.mock('../../../../services/format-conditional-form/');

const mockForm = {
  controls: {
    tevreden: {
      meta: {
        isVisible: true,
        label: 'Waarom bent u tevreden?',
        values: {}
      }
    },
    tevreden_anders: {
      meta: {
        isVisible: false
      }
    },
    niet_tevreden: {
      meta: {
        isVisible: true,
        label: 'Waarom bent u ontevreden?',
        values: {}
      }
    },
    niet_tevreden_anders: {
      meta: {
        isVisible: false
      }
    },
    text_extra: {
      meta: {
        isVisible: true,
        label: 'Wilt u verder nog iets vermelden of toelichten?'
      }
    },
    allows_contact: {
      meta: {
        isVisible: true,
        label: 'Mogen wij conact met u opnemen naar aanleiding vanuw feedback?'
      }
    },
    is_satisfied: {
      meta: {
        isVisible: true,
        label: 'Is tevreden?'
      }
    },
    not_update: {
      meta: {
        isVisible: true,
        doNotUpdateValue: true
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
        form: {},
        answers: {}
      },
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
    it('expect to render YES form correctly', () => {
      wrapper.setProps({
        ktoContainer: {
          form: {
            yesNo: 'ja'
          },
          answers: {
            'Antwoord JA': 'Antwoord JA'
          }
        }
      });
      expect(wrapper).toMatchSnapshot();
    });

    it('expect to render NO form correctly', () => {
      wrapper.setProps({
        ktoContainer: {
          form: {
            yesNo: 'nee'
          },
          answers: {
            'Antwoord NEE': 'Antwoord NEE'
          }
        }
      });
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('events', () => {
    let form;

    it('expect to update kto', () => {
      const values = { text_extra: 'weer andere tekst' };
      instance.updateKto(values);

      expect(props.onUpdateKto).toHaveBeenCalledWith(values);
    });

    it('expect to set values when form vars have changed', () => {
      form = { text_extra: 'weer andere tekst', is_satisfied: true };
      instance.form.patchValue(form);
      const ktoContainer = { form };
      wrapper.setProps({ ktoContainer });

      expect(spy).toHaveBeenCalledWith(form);
    });

    it('submit JA should trigger store kto', () => {
      form = {
        tevreden: {},
        tevreden_anders: '',
        text_extra: 'Zoveel te vertellen',
        allows_contact: { value: true },
        is_satisfied: true
      };
      instance.form.patchValue(form);
      const ktoContainer = {
        form,
        uuid: 'abc-42'
      };
      wrapper.setProps({ ktoContainer });

      wrapper.find('form').simulate('submit', { preventDefault: jest.fn() });

      expect(props.onStoreKto).toHaveBeenCalledWith({
        uuid: 'abc-42',
        form: {
          text: '',
          text_extra: 'Zoveel te vertellen',
          allows_contact: true,
          is_satisfied: true
        }
      });
    });

    it('submit NEE with Anders-option should trigger store kto', () => {
      form = {
        niet_tevreden: {
          id: 'anders',
          label: andersOptionText
        },
        niet_tevreden_anders: 'Meer over die melding',
        text_extra: '',
        is_satisfied: false
      };
      instance.form.patchValue(form);
      const ktoContainer = {
        form,
        uuid: 'abc-42'
      };
      wrapper.setProps({ ktoContainer });

      wrapper.find('form').simulate('submit', { preventDefault: jest.fn() });

      expect(props.onStoreKto).toHaveBeenCalledWith({
        uuid: 'abc-42',
        form: {
          text: 'Meer over die melding',
          text_extra: '',
          allows_contact: false,
          is_satisfied: false
        }
      });
    });
  });
});
