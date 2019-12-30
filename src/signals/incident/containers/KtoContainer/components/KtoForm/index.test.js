import React from 'react';
import { render } from '@testing-library/react';
import { mount } from 'enzyme';
import { withAppContext } from 'test/utils';

import KtoForm, { andersOptionText } from './index';

describe('<KtoForm />', () => {
  let props;
  let wrapper;
  let instance;
  let spy;

  beforeEach(() => {
    props = {
      fieldConfig: {
        controls: {},
      },
      ktoContainer: {
        form: {},
        answers: {},
      },
      onUpdateKto: jest.fn(),
      onStoreKto: jest.fn(),
    };

    wrapper = mount(
      <KtoForm {...props} />
    );

    instance = wrapper.instance();

    spy = jest.spyOn(instance, 'setValues');
  });

  describe('rendering', () => {
    it('expect to render YES form correctly', () => {
      const { queryByText, rerender } = render(
        withAppContext(
          <KtoForm {...props} />,
        ),
      );

      const yesProps = {
        ...props,
        ktoContainer: {
          form: {
            is_satisfied: true,
            yesNo: 'ja',
          },
          answers: {
            'Antwoord JA': 'Antwoord JA',
          },
        },
      };

      rerender(
        withAppContext(
          <KtoForm {...yesProps} />,
        ),
      );

      expect(queryByText('Waarom bent u tevreden?')).toBeInTheDocument();
      expect(queryByText('Antwoord JA')).toBeInTheDocument();
      expect(queryByText('Wilt u verder nog iets vermelden of toelichten?')).toBeInTheDocument();
    });

    it('expect to render NO form correctly', () => {
      const { queryByText, rerender } = render(
        withAppContext(
          <KtoForm {...props} />,
        ),
      );

      const noProps = {
        ...props,
        ktoContainer: {
          form: {
            is_satisfied: false,
            yesNo: 'nee',
          },
          answers: {
            'Antwoord NEE': 'Antwoord NEE',
          },
        },
      };

      rerender(
        withAppContext(
          <KtoForm {...noProps} />,
        ),
      );

      expect(queryByText('Waarom bent u niet tevreden?')).toBeInTheDocument();
      expect(queryByText('Antwoord NEE')).toBeInTheDocument();
      expect(queryByText('Wilt u verder nog iets vermelden of toelichten?')).toBeInTheDocument();
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
        is_satisfied: true,
      };
      instance.form.patchValue(form);
      const ktoContainer = {
        form,
        uuid: 'abc-42',
      };
      wrapper.setProps({ ktoContainer });

      wrapper.find('form').simulate('submit', { preventDefault: jest.fn() });

      expect(props.onStoreKto).toHaveBeenCalledWith({
        uuid: 'abc-42',
        form: {
          text: '',
          text_extra: 'Zoveel te vertellen',
          allows_contact: true,
          is_satisfied: true,
        },
      });
    });

    it('submit NEE with Anders-option should trigger store kto', () => {
      form = {
        niet_tevreden: {
          id: 'anders',
          label: andersOptionText,
        },
        niet_tevreden_anders: 'Meer over die melding',
        text_extra: 'Zoveel te vertellen',
        is_satisfied: false,
      };
      instance.form.patchValue(form);
      const ktoContainer = {
        form,
        uuid: 'abc-42',
      };
      wrapper.setProps({ ktoContainer });

      wrapper.find('form').simulate('submit', { preventDefault: jest.fn() });

      expect(props.onStoreKto).toHaveBeenCalledWith({
        uuid: 'abc-42',
        form: {
          text: 'Meer over die melding',
          text_extra: 'Zoveel te vertellen',
          allows_contact: false,
          is_satisfied: false,
        },
      });
    });
  });
});
