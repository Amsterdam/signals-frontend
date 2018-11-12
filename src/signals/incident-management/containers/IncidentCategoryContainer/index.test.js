import React from 'react';
import { shallow } from 'enzyme';

import { IncidentCategoryContainer, mapDispatchToProps } from './index';
import { REQUEST_CATEGORY_UPDATE } from './constants';

jest.mock('./components/Add', () => () => 'Add');

describe('<IncidentCategoryContainer />', () => {
  let props;

  beforeEach(() => {
    props = {
      id: '1',
      categories: { subcategories: [] },
      incidentCategoryContainer: { loading: false },
      onRequestCategoryUpdate: jest.fn(),
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render correctly', () => {
    const wrapper = shallow(
      <IncidentCategoryContainer {...props} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  describe('mapDispatchToProps', () => {
    const dispatch = jest.fn();

    it('should request the category update', () => {
      mapDispatchToProps(dispatch).onRequestCategoryUpdate({});
      expect(dispatch).toHaveBeenCalledWith({ type: REQUEST_CATEGORY_UPDATE, payload: {} });
    });
  });
});
