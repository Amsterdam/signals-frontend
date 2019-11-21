import React from 'react';
import { shallow } from 'enzyme';

import CheckboxInput from './index';

describe('Form component <CheckboxInput />', () => {
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
      <CheckboxInput
        handler={handler}
        parent={parent}
        touched={touched}
        hasError={hasError}
        getError={getError}
      />
    );

    handler.mockImplementation(() => ({
      value: {
        value: true,
        label: 'Ja dat wil ik',
      },
    }));
  });

  describe('rendering', () => {
    it('should render checkbox correctly', () => {
      wrapper.setProps({
        meta: {
          name: 'input-field-name',
          value: 'Ja, dat is goed',
          isVisible: true,
        },
      });

      expect(wrapper).toMatchSnapshot();
    });

    it('should render multi checkbox correctly', () => {
      handler = handler.mockImplementation(() => ({
        value: ['blue'],
      }));

      wrapper.setProps({
        meta: {
          name: 'input-field-name',
          values: { red: 'Rood', blue: 'Blauw', green: 'Groen' },
          isVisible: true,
        },
      });

      expect(wrapper).toMatchSnapshot();
    });

    it('should render multi checkbox without value correctly', () => {
      handler = handler.mockImplementation(() => ({ value: undefined }));

      wrapper.setProps({
        meta: {
          name: 'input-field-name',
          values: { red: 'Rood', blue: 'Blauw', green: 'Groen' },
          isVisible: true,
        },
      });

      expect(wrapper).toMatchSnapshot();
    });

    it('should render no checkbox when not visible', () => {
      wrapper.setProps({
        meta: {
          name: 'input-field-name',
          isVisible: false,
        },
      });

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('events', () => {
    it('can be checked and unchecked with default values', () => {
      wrapper.setProps({
        meta: {
          name: 'input-field-name',
          value: 'Ja, dat is goed',
          isVisible: true,
        },
      });

      const checkEevent = { target: { checked: true } };
      wrapper.find('input').simulate('click', checkEevent);

      expect(parent.meta.updateIncident).toHaveBeenCalledWith({
        'input-field-name': {
          value: true,
          label: 'Ja, dat is goed',
        },
      });

      const uncheckEevent = { target: { checked: false } };
      wrapper.find('input').simulate('click', uncheckEevent);

      expect(parent.meta.updateIncident).toHaveBeenCalledWith({
        'input-field-name': { value: false, label: 'Ja, dat is goed' },
      });
    });

    it('can be checked and unchecked with multiple values', () => {
      handler = handler.mockImplementation(() => ({
        value: [{ id: 'blue', label: 'Blauw' }],
      }));

      wrapper.setProps({
        meta: {
          name: 'input-field-name',
          values: { red: 'Rood', blue: 'Blauw', green: 'Groen' },
          isVisible: true,
        },
      });

      const checkEevent = { target: { checked: true } };
      wrapper
        .find('input[type="checkbox"]')
        .at(2)
        .simulate('click', checkEevent);

      expect(parent.meta.updateIncident).toHaveBeenCalledWith({
        'input-field-name': [
          { id: 'blue', label: 'Blauw' },
          { id: 'green', label: 'Groen' },
        ],
      });

      const uncheckEevent = { target: { checked: false } };
      wrapper
        .find('input[type="checkbox"]')
        .at(2)
        .simulate('click', uncheckEevent);

      expect(parent.meta.updateIncident).toHaveBeenCalledWith({
        'input-field-name': [{ id: 'blue', label: 'Blauw' }],
      });
    });
  });
});
