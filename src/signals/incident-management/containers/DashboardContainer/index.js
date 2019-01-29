import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';
import { FormBuilder } from 'react-reactive-form';
import { isEqual } from 'lodash';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import LoadingIndicator from 'shared/components/LoadingIndicator';
import makeSelectDashboardContainer from './selectors';
import reducer from './reducer';
import saga from './saga';
import './style.scss';

import FieldControlWrapper from '../../components/FieldControlWrapper';
import SelectInput from '../../components/SelectInput';
import StatusChart from './components/StatusChart';
import CategoryChart from './components/CategoryChart';
import TodayChart from './components/TodayChart';
import HourChart from './components/HourChart';

import { requestDashboard, updateDashboard } from './actions';

export const defaultIntervalTime = 0;
const values = [{
  key: defaultIntervalTime,
  value: 'niet verversen'
},
{
  key: 2000,
  value: 'DEBUG ververs elke 2 seconden'
},
{
  key: 30000,
  value: 'ververs elke 3 minuten'
},
{
  key: 100000,
  value: 'ververs elke 10 minuten'
}];

export class DashboardContainer extends React.PureComponent {
  static clearInterval(intervalInstance) {
    global.window.clearInterval(intervalInstance);
  }

  constructor(props) {
    super(props);

    this.state = {
      intervalInstance: props.intervalInstance,
      intervalTime: props.intervalTime,
      dashboard: props.dashboard,
      dashboardForm: FormBuilder.group({ intervalTime: defaultIntervalTime })
    };

    this.handleIntervalChange = this.handleIntervalChange.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    if (!isEqual(props.incidentDashboardContainer.dashboard, state.dashboard)) {
      return {
        dashboard: props.incidentDashboardContainer.dashboard
      };
    }

    return null;
  }

  componentDidMount() {
    this.props.onRequestDashboard();
    this.state.dashboardForm.get('intervalTime').valueChanges.subscribe(this.handleIntervalChange);
  }

  componentWillUnmount() {
    DashboardContainer.clearInterval(this.state.intervalInstance);
  }

  static setInterval(intervalTime, callback) {
    return intervalTime > 0 ? global.window.setInterval(callback, intervalTime) : {};
  }

  handleIntervalChange(value) {
    DashboardContainer.clearInterval(this.state.intervalInstance);
    this.setState({
      intervalTime: value,
      intervalInstance: DashboardContainer.setInterval(value, this.props.onUpdateDashboard)
    });
  }

  render() {
    const { loading } = this.props.incidentDashboardContainer;
    const { dashboard } = this.state;
    return (
      <div className="dashboard">
        {loading ? <LoadingIndicator /> :
        (
          <div>
            <FieldControlWrapper
              render={SelectInput}
              name="intervalTime"
              control={this.state.dashboardForm.get('intervalTime')}
              values={values}
            />
            <div className="dashboard-charts">
              <TodayChart data={dashboard.total} />
              <CategoryChart data={dashboard.category} />
              <StatusChart data={dashboard.status} />
              <HourChart data={dashboard.hour} />
            </div>
          </div>
        )}
      </div>
    );
  }
}

DashboardContainer.defaultProps = {
  intervalInstance: {},
  intervalTime: defaultIntervalTime,
  dashboard: {},
  loading: true,
  dashboardForm: {}
};

DashboardContainer.propTypes = {
  intervalInstance: PropTypes.object,
  intervalTime: PropTypes.number,
  dashboard: PropTypes.object,
  incidentDashboardContainer: PropTypes.object,
  loading: PropTypes.bool,
  onRequestDashboard: PropTypes.func.isRequired,
  onUpdateDashboard: PropTypes.func.isRequired
};

const mapStateToProps = createStructuredSelector({
  incidentDashboardContainer: makeSelectDashboardContainer()
});

export const mapDispatchToProps = (dispatch) => bindActionCreators({
  onRequestDashboard: requestDashboard,
  onUpdateDashboard: updateDashboard
}, dispatch);

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'incidentDashboardContainer', reducer });
const withSaga = injectSaga({ key: 'incidentDashboardContainer', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(DashboardContainer);
