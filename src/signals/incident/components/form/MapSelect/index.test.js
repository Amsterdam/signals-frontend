import React from 'react';
import { shallow } from 'enzyme';
import MapSelectFormComponent from "./index";

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
  });
});
