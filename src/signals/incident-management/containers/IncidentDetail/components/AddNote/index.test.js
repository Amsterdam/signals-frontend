import React from 'react';
import { shallow } from 'enzyme';

import { FieldGroup } from 'react-reactive-form';

import AddNote from './index';

jest.mock('shared/services/list-helper/list-helper');

describe('<AddNote />', () => {
  let wrapper;
  let props;
  let instance;

  beforeEach(() => {
    props = {
      id: '42',
      onPatchIncident: jest.fn()
    };

    wrapper = shallow(
      <AddNote {...props} />
    );

    instance = wrapper.instance();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('show value', () => {
    it('should show value and not form', () => {
      expect(wrapper.find('.add-note__show-form')).toHaveLength(1);
      expect(wrapper.find(FieldGroup)).toHaveLength(0);
    });

    it('should show the form when edit button has been clicked ', () => {
      wrapper.find('.add-note__show-form').simulate('click');

      expect(wrapper.find(FieldGroup)).toHaveLength(1);
    });
  });

  describe('show form', () => {
    let renderedFormGroup;

    beforeEach(() => {
      wrapper.setState({ formVisible: true });
      renderedFormGroup = wrapper.find(FieldGroup).shallow().dive();
    });

    it('should contain the FieldGroup', () => {
      expect(wrapper.find(FieldGroup)).toHaveLength(1);
    });

    it('should render field and buttons correctly', () => {
      expect(renderedFormGroup.find('.add-note__form-input')).toHaveLength(1);

      expect(renderedFormGroup.find('.add-note__form-submit')).toHaveLength(1);
      expect(renderedFormGroup.find('.add-note__form-cancel')).toHaveLength(1);
    });

    it('cancel button should hide the form', () => {
      renderedFormGroup.find('.add-note__form-cancel').simulate('click');

      expect(wrapper.find(FieldGroup)).toHaveLength(0);
    });

    it('should disable the submit button when no category is selected', () => {
      expect(renderedFormGroup.find('.add-note__form-submit').prop('disabled')).toBe(true);
    });

    it('should enable the submit button when a  category is selected', () => {
      const form = instance.form;
      const formValue = { text: 'test' };
      form.patchValue(formValue);
      expect(form.value.sub_category).toEqual(formValue.sub_category);
      expect(renderedFormGroup.find('.add-note__form-submit').prop('disabled')).toBe(false);
    });

    it('should call category update when the form is submitted (submit button is clicked)', () => {
      const text = 'yooooo';
      const form = instance.form;
      const formValue = {
        text
      };
      form.setValue(formValue);
      expect(form.value.input).toEqual(formValue.input);

      // click on the submit button doesn't work in Enzyme, this is the way to test submit functionality
      renderedFormGroup.find('form').simulate('submit', { preventDefault() { } });
      expect(props.onPatchIncident).toHaveBeenCalledWith({
        id: '42',
        type: 'notes',
        patch: {
          notes: [{ text }]
        }
      });
    });
  });
});
