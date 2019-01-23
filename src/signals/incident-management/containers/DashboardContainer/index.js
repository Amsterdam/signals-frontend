import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';
import { FormBuilder } from 'react-reactive-form';

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

const values = [{
  key: 600000,
  value: 'ververs 10 minuten'
},
{
  key: 0,
  value: 'niet verversen'
},
{
  key: 5000,
  value: 'ververs elke 5 seconden [DEBUG]'
}
];

export class DashboardContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      intervalInstance: global.window.setInterval(() => this.props.onRequestDashboard(), 5000),
      dashboardForm: FormBuilder.group({ intervalTime: 5000 })
    };
  }

  // static getDerivedStateFromProps(props, state) {
    // console.log('getDerivedStateFromProps', props.intervalTime, state.intervalTime);
    // return null;
  // }

  componentDidMount() {
    this.state.dashboardForm.get('intervalTime').valueChanges.subscribe((value) => {
      // console.log('change', value);
      global.window.clearInterval(this.state.intervalInstance);
      this.setState({
        intervalTime: value,
        intervalInstance: value > 0 ? global.window.setInterval(() => this.props.onRequestDashboard(), value) : {}
      });
    });

    this.props.onRequestDashboard();
  }

  componentWillUnmount() {
    global.window.clearInterval(this.state.intervalInstance);
  }

  render() {
    const { dashboard, firstTime } = this.props.incidentDashboardContainer;
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

DashboardContainer.propTypes = {
  incidentDashboardContainer: PropTypes.object.isRequired,
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
