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
      statusList: ['test'],
      state: 'gemeld',
      text: 'extra text',
      incidentStatusList: [{
        state: 'm'
      }],
      onRequestStatusCreate: jest.fn()
    };

    wrapper = shallow(
      <Add {...props} />
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should contain the FieldGroup', () => {
    expect(wrapper.find(FieldGroup)).toHaveLength(1);
  });

  describe('FieldGroup', () => {
    let renderedFormGroup;

    beforeEach(() => {
    });

    it('should disable the submit button when no status is selected', () => {
      renderedFormGroup = (wrapper.find(FieldGroup).shallow().dive());
      expect(renderedFormGroup.find('.incident-status-add__submit').prop('disabled')).toBe(true);
    });

    it('should enable the submit button when a status is selected', () => {
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
