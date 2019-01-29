import React from 'react';
import { shallow } from 'enzyme';

import { DashboardContainer, mapDispatchToProps, defaultIntervalTime } from './index';
import { REQUEST_DASHBOARD } from './constants';

jest.mock('../../components/FieldControlWrapper', () => () => 'FieldControlWrapper');
jest.mock('../../components/SelectInput', () => () => 'SelectInput');
jest.mock('./components/StatusChart', () => () => 'StatusChart');
jest.mock('./components/CategoryChart', () => () => 'CategoryChart');
jest.mock('./components/TodayChart', () => () => 'TodayChart');
jest.mock('./components/HourChart', () => () => 'HourChart');

describe('<DashboardContainer />', () => {
  let wrapper;
  let props;
  let originalClearInterval;

  beforeEach(() => {
    props = {
      incidentDashboardContainer: {
        loading: false,
        error: false,
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
            {
              interval_start: '2019-01-21T14:00:00',
              hour: 14,
              count: 42,
              timestamp: 1548075600000
            },
            {
              interval_start: '2019-01-21T15:00:00',
              hour: 15,
              count: 666,
              timestamp: 1548079200000
            },
            {
              interval_start: '2019-01-21T16:00:00',
              hour: 16,
              count: 3333,
              timestamp: 1548082800000
            }
          ],
          total: 638
        }
      },
      onRequestDashboard: jest.fn(),
      onUpdateDashboard: jest.fn()
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('rendering', () => {
    it('should lazy load correctly', () => {
      const originalDashboard = { ...props.incidentDashboardContainer.dashboard };
      props.incidentDashboardContainer.dashboard = {};
      props.incidentDashboardContainer.loading = true;
      wrapper = shallow(<DashboardContainer {...props} />);

      expect(wrapper).toMatchSnapshot();

      wrapper.setProps({
        incidentDashboardContainer: {
          dashboard: originalDashboard,
          loading: false
        }
      });

      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('mounting', () => {
    it('should mount correctly', () => {
      wrapper = shallow(<DashboardContainer {...props} />);

      expect(props.onRequestDashboard).toHaveBeenCalledTimes(1);
    });

    it('should unmount correctly', () => {
      wrapper = shallow(<DashboardContainer {...props} />);

      originalClearInterval = global.window.clearInterval;
      global.window.clearInterval = jest.fn();

      const intervalInstance = { interval: 'instance' };
      wrapper.setState({ intervalInstance });
      wrapper.unmount();

      expect(global.window.clearInterval).toHaveBeenCalledWith(intervalInstance);

      global.window.clearInterval = originalClearInterval;
    });
  });

  describe('refresh events', () => {
    it('should set interval time to 0 seconds by default', () => {
      wrapper = shallow(<DashboardContainer {...props} />);

      expect(wrapper.state('intervalTime')).toEqual(defaultIntervalTime);
      expect(wrapper.state('dashboardForm').value.intervalTime).toEqual(defaultIntervalTime);
    });

    it('can set interval time to 3 seconds', () => {
      wrapper = shallow(<DashboardContainer {...props} />);

      jest.useFakeTimers();

      const dashboardForm = wrapper.state('dashboardForm');
      dashboardForm.setValue({ intervalTime: 3000 });

      expect(wrapper.state('intervalTime')).toEqual(3000);
      expect(wrapper.state('dashboardForm').value.intervalTime).toEqual(3000);
      expect(global.window.setInterval).toHaveBeenCalledWith(expect.anything(), 3000);

      jest.runTimersToTime(2999);

      expect(props.onUpdateDashboard).not.toHaveBeenCalled();

      jest.runTimersToTime(1);
      expect(props.onUpdateDashboard).toHaveBeenCalled();
    });

    it('setInterval should return empty object when intervalTime is 0', () => {
      expect(DashboardContainer.setInterval(jest.fn(), 0)).toEqual({});
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
