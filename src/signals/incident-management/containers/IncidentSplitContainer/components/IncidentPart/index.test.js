import React from 'react';
import { shallow } from 'enzyme';

import IncidentPart from './index';
import priorityList from '../../../../definitions/priorityList';

describe('<IncidentPart />', () => {
  let props;

  beforeEach(() => {
    const splitForm = {
      get: jest.fn().mockImplementation((item) => ({ item }))
    };

    props = {
      index: '2',
      incident: {
        category: {},
        priority: {
          priority: ''
        }
      },
      attachments: [],
      subcategories: [{
        key: 'key',
        value: 'value',
        slug: 'slug'
      }],
      priorityList,
      splitForm
    };
  });

  describe('rendering', () => {
    it('should render correctly without image', () => {
      const wrapper = shallow(
        <IncidentPart {...props} />
      );
      expect(wrapper).toMatchSnapshot();
    });

    it('should render correctly with image', () => {
      props.attachments.push({ location: 'mock-image' });
      const wrapper = shallow(
        <IncidentPart {...props} />
      );
      expect(wrapper).toMatchSnapshot();
    });
  });
});
