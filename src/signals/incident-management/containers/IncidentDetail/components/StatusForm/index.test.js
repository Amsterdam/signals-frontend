import React from 'react';
import { render } from '@testing-library/react';
import { shallow } from 'enzyme';
import { withAppContext } from 'test/utils';

import { FieldGroup } from 'react-reactive-form';

import StatusForm from './index';

import statusList, { changeStatusOptionList, defaultTextsOptionList } from '../../../../definitions/statusList';

jest.mock('./components/DefaultTexts', () => () => <div data-testid="status-form-default-texts" />);

describe('<StatusForm />', () => {
  let wrapper;
  let props;
  let instance;

  beforeEach(() => {
    props = {
      incident: {
        id: 42,
        status: {
          state: 'reopen requested',
        },
      },
      patching: { location: false },
      error: false,
      changeStatusOptionList,
      defaultTextsOptionList,
      statusList,
      defaultTexts: [],
      onPatchIncident: jest.fn(),
      onDismissError: jest.fn(),
      onClose: jest.fn(),
    };
  });

  const getComponent = prps => {
    const wrap = shallow(
      <StatusForm {...prps} />
    );

    const inst = wrap.instance();

    return [wrap, inst];
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should contain the FieldGroup', () => {
    [wrapper] = getComponent(props);

    expect(wrapper.find(FieldGroup)).toHaveLength(1);
    expect(props.onDismissError).toHaveBeenCalledTimes(1);
  });

  it('should contain render unauthorized error', () => {
    props.error = {
      response: {
        status: 403,
      },
    };

    const { queryByTestId } = render(
      withAppContext(<StatusForm {...props} />)
    );

    expect(queryByTestId('statusFormError')).toHaveTextContent(/^Je bent niet geautoriseerd om dit te doen\.$/);
  });

  it('should contain render other error', () => {
    props.error = {
      response: {
        status: 400,
      },
    };

    const { queryByTestId } = render(
      withAppContext(<StatusForm {...props} />)
    );

    expect(queryByTestId('statusFormError')).toHaveTextContent(/^De gekozen status is niet mogelijk in deze situatie\.$/);
  });


  it('should contain loading indicator when patching error', () => {
    props.patching = {
      status: true,
    };

    const { queryByTestId } = render(
      withAppContext(<StatusForm {...props} />)
    );

    expect(queryByTestId('statusFormSpinner')).not.toBeNull();
  });

  it('should render form correctly', () => {
    const { queryByText, queryByTestId } = render(
      withAppContext(<StatusForm {...props} />)
    );

    expect(queryByText('Huidige status')).not.toBeNull();
    expect(queryByText('Verzoek tot heropenen')).not.toBeNull();

    expect(queryByText('Nieuwe status')).not.toBeNull();
    expect(queryByText('In behandeling')).not.toBeNull();

    expect(queryByTestId('statusFormSubmitButton')).toHaveTextContent(/^Status opslaan$/);
    expect(queryByTestId('statusFormCancelButton')).toHaveTextContent(/^Annuleren$/);
  });

  it('should close the status form when result is ok', () => {
    const { rerender } = render(
      withAppContext(<StatusForm {...props} />)
    );

    props.patching = { status: false };
    props.error = { response: { ok: true } };

    rerender(
      withAppContext(<StatusForm {...props} />)
    );

    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  it('should not close the status form when result triggers an error', () => {
    const { rerender } = render(
      withAppContext(<StatusForm {...props} />)
    );

    props.patching = { status: false };
    props.error = { response: { ok: false, status: 500 } };

    rerender(
      withAppContext(<StatusForm {...props} />)
    );

    expect(props.onClose).not.toHaveBeenCalled();
  });

  describe('FieldGroup', () => {
    let renderedFormGroup;

    beforeEach(() => {
      [wrapper, instance] = getComponent(props);

      renderedFormGroup = wrapper.find(FieldGroup).shallow().dive();
    });

    it('should set default text when it has triggered', () => {
      instance.handleUseDefaultText({ preventDefault: jest.fn() }, 'default text');

      expect(instance.form.value.text).toEqual('default text');
    });

    it('should call patch status when the form is submitted (submit button is clicked)', () => {
      const form = instance.form;
      const formValues = {
        status: 'o',
        text: 'boooooo',
      };
      form.patchValue(formValues);

      // click on the submit button doesn't work in Enzyme, this is the way to test submit functionality
      renderedFormGroup.find('form').simulate('submit', { preventDefault() { } });
      expect(props.onPatchIncident).toHaveBeenCalledWith({
        id: 42,
        patch: {
          status: {
            state: 'o',
            text: 'boooooo',
          },
        },
        type: 'status',
      });
    });

    it('should show an alert when the text contains template characters', () => {
      global.alert = jest.fn();
      const form = instance.form;
      const formValues = {
        status: 'o',
        text: 'Bedankt voor het melden, binnen {{ aantal }} werkdagen zal uw verzoek in behandeling worden genomen.',
      };
      form.patchValue(formValues);

      // click on the submit button doesn't work in Enzyme, this is the way to test submit functionality
      renderedFormGroup.find('form').simulate('submit', { preventDefault() { } });

      expect(global.alert).toHaveBeenCalled();
      expect(props.onPatchIncident).not.toHaveBeenCalledWith();
    });
  });
});
