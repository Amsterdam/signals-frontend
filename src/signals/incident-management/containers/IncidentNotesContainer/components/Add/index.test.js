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
      notesList: ['test'],
      state: 'gemeld',
      text: 'extra text',
      incidentNotesList: [{
        state: 'm'
      }],
      onRequestNoteCreate: jest.fn()
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

    describe('rendering', () => {
      it('should render FormGroup correctly', () => {
        renderedFormGroup = (wrapper.find(FieldGroup).shallow().dive());
        expect(renderedFormGroup).toMatchSnapshot();
      });

      it('should render error', () => {
        wrapper.setProps({ error: true });

        renderedFormGroup = (wrapper.find(FieldGroup).shallow().dive());
        expect(renderedFormGroup).toMatchSnapshot();
      });

      it('should render loading', () => {
        wrapper.setProps({ loading: true });

        renderedFormGroup = (wrapper.find(FieldGroup).shallow().dive());
        expect(renderedFormGroup).toMatchSnapshot();
      });
    });

    it('should disable the submit button when no note text is entered', () => {
      renderedFormGroup = (wrapper.find(FieldGroup).shallow().dive());
      expect(renderedFormGroup.find('.incident-notes-add__submit').prop('disabled')).toBe(true);
    });

    it('should call note update when the form is submitted (button is clicked)', () => {
      const form = wrapper.instance().noteForm;
      const formValue = {
        ...form.value,
        text: 'Notitie'
      };
      form.setValue(formValue);
      expect(form.value.text).toEqual(formValue.text);

      renderedFormGroup = (wrapper.find(FieldGroup).shallow().dive());
      // click on the submit button doesn't work in Enzyme, this is the way to test submit functionality
      renderedFormGroup.find('form').simulate('submit', { preventDefault() { } });
      const formCallValue = { ...formValue, _signal: props.id };
      expect(props.onRequestNoteCreate).toHaveBeenCalledWith(formCallValue);
    });
  });
});
