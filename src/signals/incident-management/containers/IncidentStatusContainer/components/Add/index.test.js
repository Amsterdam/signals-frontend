import React from 'react';
import { shallow } from 'enzyme';
import { FieldGroup } from 'react-reactive-form';

import Add from './index';

describe('<Add />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      id: '1',
      statusList: [{
        key: 'gemeld',
        warning: 'warning'
      }],
      state: 'gemeld',
      text: 'extra text',
      error: false,
      incidentStatusList: [{
        state: 'm'
      }],
      changeStatusOptionList: [{
        key: 'm',
        value: 'Gemeld'
      }],
      onRequestStatusCreate: jest.fn(),
      onRequestStatusDismissError: jest.fn()
    };

    wrapper = shallow(
      <Add {...props} />
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('rendering', () => {
    it('should render correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should contain the FieldGroup', () => {
      expect(wrapper.find(FieldGroup)).toHaveLength(1);
    });
  });

  describe('FieldGroup', () => {
    let renderedFormGroup;

    beforeEach(() => {
    });

    describe('rendering', () => {
      it('should render FormGroup correctly', () => {
        renderedFormGroup = (wrapper.find(FieldGroup).shallow().dive());
        expect(renderedFormGroup).toMatchSnapshot();
      });

      it('should render normal error', () => {
        wrapper.setProps({ error: { response: { status: 400 } } });

        renderedFormGroup = (wrapper.find(FieldGroup).shallow().dive());
        expect(renderedFormGroup).toMatchSnapshot();
      });

      it('should render authentication error', () => {
        wrapper.setProps({ error: { response: { status: 403 } } });

        renderedFormGroup = (wrapper.find(FieldGroup).shallow().dive());
        expect(renderedFormGroup).toMatchSnapshot();
      });

      it('should render loading', () => {
        wrapper.setProps({ loading: true });

        renderedFormGroup = (wrapper.find(FieldGroup).shallow().dive());
        expect(renderedFormGroup).toMatchSnapshot();
      });

      it('should render loading Thor', () => {
        wrapper.setProps({ loadingExternal: true });

        renderedFormGroup = (wrapper.find(FieldGroup).shallow().dive());
        expect(renderedFormGroup).toMatchSnapshot();
      });
    });

    it('should disable the submit button when no status is selected', () => {
      renderedFormGroup = (wrapper.find(FieldGroup).shallow().dive());
      expect(renderedFormGroup.find('.incident-status-add__submit').prop('disabled')).toBe(true);
    });

    it('should enable the submit button and show warning and dismiss when a status is selected', () => {
      const form = wrapper.instance().statusForm;
      const formValue = { state: 'gemeld' };
      form.patchValue(formValue);
      expect(form.value.sub).toEqual(formValue.sub);
      renderedFormGroup = (wrapper.find(FieldGroup).shallow().dive());
      expect(renderedFormGroup.find('.incident-status-add__submit').prop('disabled')).toBe(false);
    });

    it('should call status update when the form is submitted (search button is clicked)', () => {
      const form = wrapper.instance().statusForm;
      const formValue = {
        ...form.value,
        state: 'gemeld'
      };
      form.setValue(formValue);
      expect(form.value.state).toEqual(formValue.state);

      renderedFormGroup = (wrapper.find(FieldGroup).shallow().dive());
      // click on the submit button doesn't work in Enzyme, this is the way to test submit functionality
      renderedFormGroup.find('form').simulate('submit', { preventDefault() { } });
      const formCallValue = { ...formValue, _signal: props.id };
      expect(props.onRequestStatusCreate).toHaveBeenCalledWith(formCallValue);
    });
  });
});
