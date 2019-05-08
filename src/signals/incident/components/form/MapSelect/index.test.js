import React from 'react';
import { shallow } from 'enzyme';
import MapSelectFormComponent from "./index";
import MaxSelection from "../../../../../utils/maxSelection";

describe('Form component <MapSelectFormComponent />', () => {
  const metaFields = {
    name: 'input-field-name',
    type: 'text',
  };

  let handler;
  let touched;
  let getError;
  let hasError;
  let parent;

  const createComponent = () => {
    handler = jest.fn();
    touched = false;
    getError = jest.fn();
    hasError = jest.fn();
    parent = {
      meta: {
        updateIncident: jest.fn()
      }
    };
    const meta = {
      name: 'my_question',
      isVisible: true,
      endpoint: 'foo/bar?',
      legend_items: [
        'klok'
      ]
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

    it('should update selection', () => {
      const wrapper = createComponent();

      const selection = new MaxSelection(3);
      selection.add('obj002');
      wrapper.find('MapSelect').props().onSelectionChange(selection);

      expect(parent.meta.updateIncident).toHaveBeenCalledWith({'my_question': ['obj002']});
    })
  });
});
