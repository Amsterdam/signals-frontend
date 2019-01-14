import React from 'react';
import { shallow } from 'enzyme';

import { DashboardContainer, mapDispatchToProps } from './index';
import { REQUEST_DASHBOARD } from './constants';

jest.mock('../../components/FieldControlWrapper', () => () => 'FieldControlWrapper');
jest.mock('../../components/SelectInput', () => () => 'SelectInput');
jest.mock('./components/StatusChart', () => () => 'StatusChart');
jest.mock('./components/CategoryChart', () => () => 'CategoryChart');
jest.mock('./components/TodayChart', () => () => 'TodayChart');
jest.mock('./components/HourChart', () => () => 'HourChart');

describe('<DashboardContainer />', () => {
  let props;

  beforeEach(() => {
    props = {
      incidentDashboardContainer: {
        dashboard: {
          status: [
            { name: 'Gemeld', count: 57, color: '#23B0C3' },
            { name: 'In afhandeling van behandeling', count: 7, color: '#E8663F' },
            { name: 'In behandeling', count: 20, color: '#FE952F' },
            { name: 'Geannuleerd', count: 2, color: '#96C14F' },
            { name: 'Afgehandeld', count: 13, color: '#9B4474' },
            { name: 'On hold', count: 1, color: '#E8663F' }
          ],
          category: [
            { name: 'Overlast op het water', count: 2 },
            { name: 'Overlast van dieren', count: 9 },
            { name: 'Overlast van en door personen en groepen', count: 9 },
            { name: 'Overlast bedrijven en horeca', count: 12 },
            { name: 'Openbaar groen en water', count: 28 },
            { name: 'Overlast in de openbare ruimte', count: 82 },
            { name: 'Overig', count: 88 },
            { name: 'Wegen verkeer straatmeubileir ', count: 126 },
            { name: 'Afval', count: 250 }
          ],
          hour: [
            { hour: 0, count: 8 },
            { hour: 1, count: 7 },
            { hour: 2, count: 12 },
            { hour: 3, count: 1 },
            { hour: 4, count: 8 },
            { hour: 5, count: 42 },
            { hour: 6, count: 70 },
            { hour: 7, count: 60 },
            { hour: 8, count: 93 },
            { hour: 9, count: 137 },
            { hour: 10, count: 64 },
            { hour: 11, count: 71 },
            { hour: 12, count: 12 }
          ],
          today: { count: 638 }
        }
      },
      onRequestDashboard: jest.fn(),
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('rendering', () => {
    it('should render correctly: mount and unmount', () => {
      global.window.setInterval = jest.fn();
      global.window.clearInterval = jest.fn();

      const wrapper = shallow(
        <DashboardContainer {...props} />
      );
      expect(wrapper).toMatchSnapshot();
      expect(global.window.setInterval).toHaveBeenCalledTimes(1);
      expect(global.window.clearInterval).not.toHaveBeenCalled();

      jest.resetAllMocks();

      wrapper.unmount();
      expect(global.window.setInterval).not.toHaveBeenCalled();
      expect(global.window.clearInterval).toHaveBeenCalledTimes(1);

      jest.resetAllMocks();
    });
  });

  describe('events', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    it('should set timer interval to 5 seconds by default', () => {
      const wrapper = shallow(
        <DashboardContainer {...props} />
      );

      jest.runOnlyPendingTimers();

      expect(wrapper.state('intervalInstance')).toEqual(1);
      expect(wrapper.state('dashboardForm').value.intervalTime).toEqual(5000);
    });

    it('should set interval to 3 seconds when time value has changed', () => {
      const wrapper = shallow(
        <DashboardContainer {...props} />
      );

      const dashboardForm = wrapper.state('dashboardForm');
      const dashboardValue = {
        ...dashboardForm.value,
        intervalTime: 3000
      };
      dashboardForm.setValue(dashboardValue);
      expect(wrapper.state('dashboardForm').value.intervalTime).toEqual(3000);

      jest.runTimersToTime(2999);
      expect(props.onRequestDashboard).toHaveBeenCalledTimes(1);

      jest.runTimersToTime(1);
      expect(props.onRequestDashboard).toHaveBeenCalledTimes(2);
    });
  });

  describe('mapDispatchToProps', () => {
    const dispatch = jest.fn();

    it('should request the category update', () => {
      mapDispatchToProps(dispatch).onRequestDashboard({});
      expect(dispatch).toHaveBeenCalledWith({ type: REQUEST_DASHBOARD });
    });
  });
});
