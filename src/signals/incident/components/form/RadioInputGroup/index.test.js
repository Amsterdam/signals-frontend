import React from 'react';
import { shallow } from 'enzyme';

import RadioInput from '.';

describe('Form component <RadioInput />', () => {
  const metaFields = {
    name: 'input-field-name',
    placeholder: 'type here',
    values: {
      foo: 'Foo',
      bar: 'Bar',
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

    wrapper = shallow(
      <RadioInput handler={handler} parent={parent} touched={touched} hasError={hasError} getError={getError} />
    );

    handler.mockImplementation(() => ({
      value: {
        id: 'foo',
        label: 'Foo',
      },
    }));
  });

  describe('rendering', () => {
    it('should render radio fields correctly', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: true,
        },
      });

      expect(wrapper).toMatchSnapshot();
    });

    it('should render info from current selection correctly', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: true,
          values: {
            foo: {
              value: 'foo',
              info: 'info',
            },
          },
        },
        parent: {
          meta: {
            incident: {
              [metaFields.name]: {
                id: 'foo',
              },
            },
          },
        },
      });

      expect(wrapper).toMatchSnapshot();
    });

    it('should render zero radio fields when values are not supplied', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: true,
          values: undefined,
        },
      });

      expect(wrapper).toMatchSnapshot();
    });

    it('should render no radio field when not visible', () => {
      wrapper.setProps({
        meta: {
          ...metaFields,
          isVisible: false,
        },
      });

      expect(wrapper).toMatchSnapshot();
    });
  });
});
