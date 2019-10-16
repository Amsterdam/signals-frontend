import React from 'react';
import { shallow } from 'enzyme';
import MapSelectFormComponent from './index';
import MaxSelection from '../../../../../utils/maxSelection';

describe('Form component <MapSelectFormComponent />', () => {
  let handler;
  let touched;
  let getError;
  let hasError;
  let parent;
  let meta;

  beforeEach(() => {
    handler = jest.fn();
    handler.mockReturnValue({ value: '' });
    getError = jest.fn();
    hasError = jest.fn();
  });

  const createComponent = () => {
    touched = false;
    parent = {
      meta: {
        updateIncident: jest.fn(),
      },
    };
    meta = {
      name: 'my_question',
      isVisible: true,
      endpoint: 'foo/bar?',
      legend_items: [
        'klok',
      ],
    };

    return shallow(<MapSelectFormComponent
      handler={handler}
      parent={parent}
      touched={touched}
      hasError={hasError}
      getError={getError}
      meta={meta}
    />);
  };

  describe('rendering', () => {
    it('should render the MapSelect component', () => {
      const wrapper = createComponent();

      expect(wrapper).toMatchSnapshot();
    });

    it('should use the handler value', () => {
      handler.mockReturnValue({ value: ['obj1'] });
      const wrapper = createComponent();

      expect(wrapper.find('MapSelect').props().value).toEqual(['obj1']);
    });

    it('should update selection', () => {
      const wrapper = createComponent();

      const selection = new MaxSelection(3);
      selection.add('obj002');
      wrapper.find('MapSelect').props().onSelectionChange(selection);

      expect(parent.meta.updateIncident).toHaveBeenCalledWith({ my_question: ['obj002'] });
    });

    it('should render no map field when not visible', () => {
      const wrapper = createComponent();

      wrapper.setProps({
        meta: {
          ...meta,
          isVisible: false,
        },
      });

      expect(handler).toHaveBeenCalledWith();
      expect(wrapper).toMatchSnapshot();
    });
  });
});
