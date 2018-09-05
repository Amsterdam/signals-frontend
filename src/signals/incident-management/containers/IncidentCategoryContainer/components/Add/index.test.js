import React from 'react';
import { shallow } from 'enzyme';
import { FieldGroup } from 'react-reactive-form';
import { mockRandom } from 'jest-mock-random';

import Add from './index';

describe('<Add />', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    mockRandom(0.666);
    props = {
      id: '1',
      subcategoryList: ['test'],
      onRequestCategoryUpdate: jest.fn()
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

    it('should disable the submit button when no category is selected', () => {
      renderedFormGroup = (wrapper.find(FieldGroup).shallow().dive());
      expect(renderedFormGroup.find('button').prop('disabled')).toBe(true);
    });

    it('should enable the submit button when a  category is selected', () => {
      const form = wrapper.instance().categoryForm;
      const formValue = { sub: 'test' };
      form.patchValue(formValue);
      expect(form.value.sub).toEqual(formValue.sub);
      renderedFormGroup = (wrapper.find(FieldGroup).shallow().dive());
      expect(renderedFormGroup.find('button').prop('disabled')).toBe(false);
    });

    it('should call category update when the form is submitted (search button is clicked)', () => {
      const form = wrapper.instance().categoryForm;
      const formValue = {
        ...form.value,
        sub: 'test'
      };
      form.setValue(formValue);
      expect(form.value.sub).toEqual(formValue.sub);

      renderedFormGroup = (wrapper.find(FieldGroup).shallow().dive());
      // click on the submit button doesn't work in Enzyme, this is the way to test submit functionality
      renderedFormGroup.find('form').simulate('submit', { preventDefault() { } });
      const formCallValue = { ...formValue, _signal: props.id };
      expect(props.onRequestCategoryUpdate).toHaveBeenCalledWith(formCallValue);
    });
  });
});
