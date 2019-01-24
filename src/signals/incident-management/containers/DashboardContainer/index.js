import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';
import { FormBuilder } from 'react-reactive-form';
import { isEqual, isEmpty } from 'lodash';

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

import { requestDashboard } from './actions';

const defaultIntervalTime = 0;
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
    if (intervalInstance) {
      global.window.clearInterval(intervalInstance);
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      intervalInstance: props.intervalInstance,
      intervalTime: props.intervalTime,
      dashboard: props.dashboard,
      firstTime: props.firstTime,
      dashboardForm: props.dashboardForm
    };
  }

  static getDerivedStateFromProps(props, state) {
    let response = {};
    if (!isEqual(props.incidentDashboardContainer.firstTime, state.firstTime)) {
      response = {
        ...response,
        firstTime: props.incidentDashboardContainer.firstTime,
        intervalInstance: DashboardContainer.setInterval(state.intervalTime, props)
      };
    }

    if (!isEqual(props.incidentDashboardContainer.dashboard, state.dashboard)) {
      response = {
        ...response,
        dashboard: props.incidentDashboardContainer.dashboard
      };
    }

    return isEmpty(response) ? null : response;
  }

  componentDidMount() {
    this.props.onRequestDashboard();

    this.state.dashboardForm.get('intervalTime').valueChanges.subscribe((value) => {
      DashboardContainer.clearInterval(this.state.intervalInstance);

      this.setState({
        intervalTime: value,
        intervalInstance: DashboardContainer.setInterval(value, this.props)
      });
    });
  }

  componentWillUnmount() {
    DashboardContainer.clearInterval(this.state.intervalInstance);
  }

  static setInterval(intervalTime, props) {
    return intervalTime > 0 ? global.window.setInterval(() => props.onRequestDashboard(), intervalTime) : {};
  }

  render() {
    const { dashboard, firstTime } = this.state;
    return (
      <div className="dashboard">
        <div className="dashboard-beta">BETA</div>
        {firstTime ? <LoadingIndicator /> :
        (
          <div>
            <FieldControlWrapper
              render={SelectInput}
              name="intervalTime"
              control={this.state.dashboardForm.get('intervalTime')}
              values={values}
            />
            <div className="dashboard-charts">
              <StatusChart data={dashboard.status} />
              <CategoryChart data={dashboard.category} />
              <TodayChart data={dashboard.total} />
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
  firstTime: true,
  dashboardForm: FormBuilder.group({ intervalTime: defaultIntervalTime })
};

DashboardContainer.propTypes = {
  intervalInstance: PropTypes.object,
  intervalTime: PropTypes.number,
  dashboard: PropTypes.object,
  firstTime: PropTypes.bool,
  dashboardForm: PropTypes.object,

  onRequestDashboard: PropTypes.func.isRequired
};

const mapStateToProps = createStructuredSelector({
  incidentDashboardContainer: makeSelectDashboardContainer()
});

export const mapDispatchToProps = (dispatch) => bindActionCreators({
  onRequestDashboard: requestDashboard
}, dispatch);

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'incidentDashboardContainer', reducer });
const withSaga = injectSaga({ key: 'incidentDashboardContainer', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(DashboardContainer);
