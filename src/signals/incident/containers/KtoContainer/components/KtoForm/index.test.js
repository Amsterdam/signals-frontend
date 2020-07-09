import React from 'react';
import { render } from '@testing-library/react';
import { mount } from 'enzyme';
import { withAppContext } from 'test/utils';

import ktoContainerMock from 'utils/__tests__/fixtures/kto.json';
import ktoMock from '../../../../definitions/kto';

import KtoForm, { andersOptionText } from '.';

// temporarily skipping tests for this component; picking up later
describe.skip('<KtoForm />', () => {
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

    wrapper = mount(withAppContext(<KtoForm {...props} />));

    instance = wrapper.find('KtoForm').instance();

    spy = jest.spyOn(instance, 'setValues');
  });

  describe('rendering', () => {
    it('expect to render YES form correctly', () => {
      const { queryByText, rerender } = render(
        withAppContext(
          <KtoForm {...props} />,
        ),
      );

      expect(queryByText(ktoMock.controls.tevreden.meta.label)).not.toBeInTheDocument();
      expect(queryByText('Antwoord Ja')).not.toBeInTheDocument();
      expect(queryByText(ktoMock.controls.text_extra.meta.label)).toBeInTheDocument();
      expect(queryByText('Verstuur')).toBeInTheDocument();

      const yesProps = {
        ...props,
        ...ktoContainerMock.yes,
      };

      rerender(
        withAppContext(
          <KtoForm {...yesProps} />,
        ),
      );

      expect(queryByText(ktoMock.controls.tevreden.meta.label)).toBeInTheDocument();
      expect(queryByText('Antwoord JA')).toBeInTheDocument();
    });

    it('expect to render NO form correctly', () => {
      const { queryByText, rerender } = render(
        withAppContext(
          <KtoForm {...props} />,
        ),
      );

      expect(queryByText(ktoMock.controls.niet_tevreden.meta.label)).not.toBeInTheDocument();
      expect(queryByText('Antwoord NEE')).not.toBeInTheDocument();
      expect(queryByText(ktoMock.controls.text_extra.meta.label)).toBeInTheDocument();
      expect(queryByText('Verstuur')).toBeInTheDocument();

      const noProps = {
        ...props,
        ...ktoContainerMock.no,
      };

      rerender(
        withAppContext(
          <KtoForm {...noProps} />,
        ),
      );

      expect(queryByText(ktoMock.controls.niet_tevreden.meta.label)).toBeInTheDocument();
      expect(queryByText('Antwoord NEE')).toBeInTheDocument();
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
