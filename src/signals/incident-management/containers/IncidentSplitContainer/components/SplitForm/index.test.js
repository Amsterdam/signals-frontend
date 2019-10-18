import React from 'react';
import { shallow } from 'enzyme';

import SplitForm from './index';

import priorityList from '../../../../definitions/priorityList';

jest.mock('../IncidentPart', () => () => 'IncidentPart');

describe('<SplitForm />', () => {
  const mockCreate = {
    category: {
      sub_category: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/poep',
    },
    reuse_parent_image: true,
    text: undefined,
  };
  const mockUpdate = {
    image: true,
    note: '',
    priority: 'high',
    subcategory: 'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/poep',
    text: undefined,
  };
  let props;

  beforeEach(() => {
    props = {
      incident: {
        category: {
          main_slug: 'afval',
          sub_slug: 'poep',
        },
        priority: {
          priority: 'high',
        },
      },
      attachments: [],
      subcategories: [{
        key: 'poep',
        value: 'Poep',
        slug: 'poep',
      }],
      priorityList,
      handleSubmit: jest.fn(),
      handleCancel: jest.fn(),
    };
  });

  describe('rendering', () => {
    it('should render correctly', () => {
      const wrapper = shallow(<SplitForm {...props} />);

      expect(wrapper).toMatchSnapshot();
    });

    it('should render 3 parts correctly', () => {
      const wrapper = shallow(<SplitForm {...props} />);
      wrapper.setState({ isVisible: true });

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('events', () => {
    it('should toggle visiblity of part 3 on and off and on again', () => {
      const wrapper = shallow(<SplitForm {...props} />);

      expect(wrapper.state('isVisible')).toBe(false);
      wrapper.find('.split-form__button-show').simulate('click');

      expect(wrapper.state('isVisible')).toBe(true);
      wrapper.find('.split-form__button-hide').simulate('click');

      expect(wrapper.state('isVisible')).toBe(false);
    });
  });

  it('should handle submit with 2 items', () => {
    const wrapper = shallow(<SplitForm {...props} />);
    wrapper.instance().handleSubmit();
    expect(props.handleSubmit).toHaveBeenCalledWith({
      create: [mockCreate, mockCreate],
      id: props.incident.id,
      update: [mockUpdate, mockUpdate],
    });
  });

  it('should handle submit with 3 items', () => {
    const wrapper = shallow(<SplitForm {...props} />);
    wrapper.setState({ isVisible: true });

    wrapper.instance().handleSubmit();
    expect(props.handleSubmit).toHaveBeenCalledWith({
      create: [mockCreate, mockCreate, mockCreate],
      id: props.incident.id,
      update: [mockUpdate, mockUpdate, mockUpdate],
    });
  });
});
