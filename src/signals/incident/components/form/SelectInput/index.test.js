import React from 'react';
import { shallow } from 'enzyme';

import Select from 'components/Select';
import SelectInput from '.';

describe('Form component <SelectInput />', () => {
  const metaFields = {
    name: 'input-field-name',
    placeholder: 'type here',
    values: {
      foo: 'Foo',
      bar: 'Bar',
      baz: 'Baz',
    },
  };
  let wrapper;
  let handler;
  let touched;
  let getError;
  let hasError;
  let parent;

  beforeEach(() => {
    handler = jest.fn();
    touched = false;
    getError = jest.fn();
    hasError = jest.fn();
    parent = {
      meta: {
        updateIncident: jest.fn(),
      },
    };

    handler.mockImplementation(() => ({
      value: {
        id: 'baz',
        label: 'Baz',
      },
    }));

    wrapper = shallow(
      <SelectInput
        handler={handler}
        parent={parent}
        touched={touched}
        hasError={hasError}
        getError={getError}
      />
    );
  });

  describe('rendering', () => {
    it('should render select field correctly', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: true,
        },
      });

      expect(wrapper).toMatchSnapshot();
    });

    it('should render empty select field when values are not supplied', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: true,
          values: undefined,
        },
      });

      expect(wrapper).toMatchSnapshot();
    });

    it('should render no select field when not visible', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: false,
        },
      });

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('events', () => {
    const event = {
      target: {
        selectedIndex: 2,
        2: {
          text: 'Baz',
        },
        value: 'baz',
      },
    };

    it('sets incident when value changes', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: true,
        },
      });

      wrapper.find(Select).simulate('change', event);

      expect(parent.meta.updateIncident).toHaveBeenCalledWith({
        'input-field-name': {
          id: 'baz',
          label: 'Baz',
        },
      });
    });
  });
});
