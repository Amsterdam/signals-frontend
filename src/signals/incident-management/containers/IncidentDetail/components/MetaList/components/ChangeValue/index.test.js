import React from 'react';
import { shallow } from 'enzyme';

import { FieldGroup } from 'react-reactive-form';

import { getListValueByKey } from 'shared/services/list-helper/list-helper';

import ChangeValue from './index';

jest.mock('shared/services/list-helper/list-helper');

describe('<ChangeValue />', () => {
  let wrapper;
  let props;
  let instance;

  beforeEach(() => {
    props = {
      incident: {
        id: 42
      },
      definitionClass: 'definition-class',
      valueClass: 'value-class',
      list: [
        { key: 'c', value: 'Cee' },
        { key: 'b', value: 'Bee' },
        { key: 'a', value: 'Aaaaaaaa' }
      ],
      display: 'De letter',
      path: 'incident.mockPath',
      // valuePath: 'incident.mockValuePath',
      patch: {},
      disabled: false,
      sort: false,
      type: 'mockType',
      onPatchIncident: jest.fn()
    };

    wrapper = shallow(
      <ChangeValue {...props} />
    );

    instance = wrapper.instance();

    getListValueByKey.mockImplementation(() => 'mock waarde');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('show value', () => {
    it('should show value and not form', () => {
      expect(wrapper.find(`.${props.definitionClass}`)).toHaveLength(1);

      expect(wrapper.find(`.${props.valueClass} button`)).toHaveLength(1);
      expect(wrapper.find(`.${props.valueClass} .change-value__value`)).toHaveLength(1);

      expect(wrapper.find(FieldGroup)).toHaveLength(0);
    });

    it('should show the form when edit button has been clicked ', () => {
      wrapper.find(`.${props.valueClass} button`).simulate('click');

      expect(wrapper.find(`.${props.valueClass} button`)).toHaveLength(0);
      expect(wrapper.find(`.${props.valueClass} .change-value__value`)).toHaveLength(0);

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
      expect(renderedFormGroup.find('.change-value__form-input')).toHaveLength(1);

      expect(renderedFormGroup.find('.change-value__form-submit')).toHaveLength(1);
      expect(renderedFormGroup.find('.change-value__form-cancel')).toHaveLength(1);
    });

    it('cancel button should hide the form', () => {
      renderedFormGroup.find('.change-value__form-cancel').simulate('click');

      expect(wrapper.find(FieldGroup)).toHaveLength(0);
    });

    it('should call category update when the form is submitted (search button is clicked)', () => {
      const form = instance.form;
      const formValue = {
        input: 'b'
      };
      form.setValue(formValue);
      expect(form.value.input).toEqual(formValue.input);

      // click on the submit button doesn't work in Enzyme, this is the way to test submit functionality
      renderedFormGroup.find('form').simulate('submit', { preventDefault() { } });
      expect(props.onPatchIncident).toHaveBeenCalledWith({
        id: 42,
        type: 'mockType',
        patch: {
          incident: {
            mockPath: 'b'
          }
        }
      });
    });
  });
});
