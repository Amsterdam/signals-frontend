import React from 'react';
import { shallow } from 'enzyme';

import { PrintLayout } from './index';

jest.mock('../IncidentDetail', () => () => 'IncidentDetail');
jest.mock('../MapDetail', () => () => 'MapDetail');
jest.mock('../../../IncidentStatusContainer/components/List', () => () => 'List');

describe('<PrintLayout />', () => {
  let props;

  beforeEach(() => {
    props = {
      id: '100',
      incident: {},
      incidentNotesList: [],
      stadsdeelList: [],
      priorityList: [],
      onPrintView: jest.fn(),
      incidentStatusContainer: { incidentStatusList: [], statusList: [] }
    };

    global.window.print = jest.fn();
  });

  it('should render correctly', () => {
    const wrapper = shallow(
      <PrintLayout {...props} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with image', () => {
    props.incident.image = 'https://www.objectstore.eu/signals/CACHE/images/images/2018/10/18/jasper_pepper_/089f0f5cdb1693b970c176763560278c.jpg';
    const wrapper = shallow(
      <PrintLayout {...props} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with location', () => {
    props.incident.location = {
      geometrie: {
        type: 'Point',
        coordinates: [
          4.870762825012208,
          52.37525531255687
        ]
      }
    };

    const wrapper = shallow(
      <PrintLayout {...props} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  describe('events', () => {
    it('should print when clicked', () => {
      const wrapper = shallow(
        <PrintLayout {...props} />
      );

      wrapper.find('button.print-layout__button').simulate('click');
      expect(global.window.print).toHaveBeenCalled();
    });
  });
});
