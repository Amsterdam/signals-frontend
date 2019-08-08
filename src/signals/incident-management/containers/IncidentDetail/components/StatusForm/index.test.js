import React from 'react';
import { shallow } from 'enzyme';

import { FieldGroup } from 'react-reactive-form';

import StatusForm from './index';

jest.mock('shared/services/map-location');
jest.mock('./components/DefaultTexts', () => () => <div data-testid="detail-header-button-download" />);

describe('<StatusForm />', () => {
  let wrapper;
  let props;
  let instance;

  beforeEach(() => {
    props = {
      incident: {
        id: 42,
        status: {
          state: 'm'
        }
      },
      patching: { location: false },
      error: false,
      changeStatusOptionList: [
        {
          key: 'm',
          value: 'Gemeld',
          color: 'red'
        },
        {
          key: 'i',
          value: 'In afwachting van behandeling',
          warning: 'De melder ontvangt deze toelichting niet.',
          color: 'purple'
        },
        {
          key: 'b',
          value: 'In behandeling',
          warning: 'De melder ontvangt deze toelichting niet, maar kan die wel opvragen door te bellen.',
          color: 'blue'
        },
        {
          key: 'o',
          value: 'Afgehandeld',
          warning: 'De melder ontvangt deze toelichting per e-mail, let dus op de schrijfstijl. De e-mail bevat al een aanhef en afsluiting. Verwijs nooit naar een andere afdeling; hercategoriseer dan de melding. Gebruik deze status alleen als de melding ook echt is afgehandeld, gebruik anders de status Ingepland.',
          color: 'lightgreen'
        },
        {
          key: 'ingepland',
          value: 'Ingepland',
          warning: 'De melder ontvangt deze toelichting per e-mail, let dus op de schrijfstijl. De e-mail bevat al een aanhef en afsluiting.',
          color: 'grey'
        },
        {
          key: 'a',
          value: 'Geannuleerd',
          warning: 'Bij deze status wordt de melding afgesloten en er wordt GEEN bericht naar de melder gestuurd. Gebruik deze status alleen voor test- en nepmeldingen of meldingen van veelmelders.',
          color: 'darkgrey'
        },
        {
          key: 'reopened',
          value: 'Heropend',
          warning: 'De melder ontvangt deze toelichting per e-mail, let dus op de schrijfstijl. De e-mail bevat al een aanhef en afsluiting. Verwijs nooit naar een andere afdeling; hercategoriseer dan de melding.',
          color: 'orange'
        }
      ],
      statusList: [
        {
          key: 'm',
          value: 'Gemeld',
          color: 'red'
        },
        {
          key: 'i',
          value: 'In afwachting van behandeling',
          warning: 'De melder ontvangt deze toelichting niet.',
          color: 'purple'
        },
        {
          key: 'b',
          value: 'In behandeling',
          warning: 'De melder ontvangt deze toelichting niet, maar kan die wel opvragen door te bellen.',
          color: 'blue'
        },
        {
          key: 'o',
          value: 'Afgehandeld',
          warning: 'De melder ontvangt deze toelichting per e-mail, let dus op de schrijfstijl. De e-mail bevat al een aanhef en afsluiting. Verwijs nooit naar een andere afdeling; hercategoriseer dan de melding. Gebruik deze status alleen als de melding ook echt is afgehandeld, gebruik anders de status Ingepland.',
          color: 'lightgreen'
        },
        {
          key: 'ingepland',
          value: 'Ingepland',
          warning: 'De melder ontvangt deze toelichting per e-mail, let dus op de schrijfstijl. De e-mail bevat al een aanhef en afsluiting.',
          color: 'grey'
        },
        {
          key: 'a',
          value: 'Geannuleerd',
          warning: 'Bij deze status wordt de melding afgesloten en er wordt GEEN bericht naar de melder gestuurd. Gebruik deze status alleen voor test- en nepmeldingen of meldingen van veelmelders.',
          color: 'darkgrey'
        },
        {
          key: 's',
          value: 'Gesplitst',
          color: 'lightgreen'
        },
        {
          key: 'reopened',
          value: 'Heropend',
          warning: 'De melder ontvangt deze toelichting per e-mail, let dus op de schrijfstijl. De e-mail bevat al een aanhef en afsluiting. Verwijs nooit naar een andere afdeling; hercategoriseer dan de melding.',
          color: 'orange'
        },
        {
          key: 'ready to send',
          value: 'Extern: te verzenden'
        },
        {
          key: 'sent',
          value: 'Extern: verzonden'
        },
        {
          key: 'send failed',
          value: 'Extern: mislukt'
        },
        {
          key: 'closure requested',
          value: 'Extern: verzoek tot afhandeling'
        },
        {
          key: 'done external',
          value: 'Extern: afgehandeld'
        }
      ],
      defaultTexts: [],
      onPatchIncident: jest.fn(),
      onDismissError: jest.fn(),
      onClose: jest.fn()
    };

    wrapper = shallow(
      <StatusForm {...props} />
    );

    instance = wrapper.instance();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should contain the FieldGroup', () => {
    expect(wrapper.find(FieldGroup)).toHaveLength(1);
    expect(props.onDismissError).toHaveBeenCalledTimes(1);
  });

  describe('FieldGroup', () => {
    let renderedFormGroup;

    beforeEach(() => {
      renderedFormGroup = wrapper.find(FieldGroup).shallow().dive();
    });

    it('should render buttons correctly', () => {
      expect(renderedFormGroup.find('.status-form__form-submit')).toHaveLength(1);
      expect(renderedFormGroup.find('.status-form__form-cancel')).toHaveLength(1);
    });

    it('should disable the submit button when no status has been selected', () => {
      expect(renderedFormGroup.find('.status-form__form-submit').prop('disabled')).toBe(true);
    });

    it('should enable the submit button when a status has been selected', () => {
      const form = instance.form;
      const formValue = {
        status: 'b'
      };
      form.patchValue(formValue);
      expect(form.value.status).toEqual(formValue.status);
      expect(form.value.coordinates).toEqual(formValue.coordinates);
      expect(renderedFormGroup.find('.status-form__form-submit').prop('disabled')).toBe(false);
    });

    it('should enable the submit button when a status with a mandatory text have been selected', () => {
      const form = instance.form;
      const newStatus = {
        status: 'o'
      };
      form.patchValue(newStatus);
      expect(form.value.status).toEqual(newStatus.status);
      expect(renderedFormGroup.find('.status-form__form-submit').prop('disabled')).toBe(true);

      const newText = {
        text: 'bla'
      };
      form.patchValue(newText);
      expect(form.value.text).toEqual(newText.text);
      expect(renderedFormGroup.find('.status-form__form-submit').prop('disabled')).toBe(false);
    });

    it('should call patch status when the form is submitted (submit button is clicked)', () => {
      const form = instance.form;
      const formValues = {
        status: 'o',
        text: 'boooooo'
      };
      form.patchValue(formValues);

      // click on the submit button doesn't work in Enzyme, this is the way to test submit functionality
      renderedFormGroup.find('form').simulate('submit', { preventDefault() { } });
      expect(props.onPatchIncident).toHaveBeenCalledWith({
        id: 42,
        patch: {
          status: {
            state: 'o',
            text: 'boooooo'
          }
        },
        type: 'status'
      });
    });

    it('should close the location form when result is ok', () => {
      wrapper.setProps({
        patching: { status: true }
      });

      wrapper.setProps({
        patching: { status: false },
        error: { response: { ok: true } }
      });

      expect(props.onClose).toHaveBeenCalledTimes(1);
    });

    it('should not close the location form when result triggers an error', () => {
      wrapper.setProps({
        patching: { status: true }
      });

      wrapper.setProps({
        patching: { lstatusocation: false },
        error: { response: { ok: false, status: 500 } }
      });

      expect(props.onClose).not.toHaveBeenCalled();
    });
  });
});

