import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';
import { FormBuilder } from 'react-reactive-form';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectDashboard from './selectors';
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
  key: 3000,
  value: 'ververs elke 3 seconden'
},
{
  key: 5000,
  value: 'ververs elke 5 seconden'
},
{
  key: 60000,
  value: 'ververs elke minuut'
},
{
  key: 600000,
  value: 'ververs 10 minuten'
}];

export class Dashboard extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      intervalInstance: window.setInterval(() => this.props.onRequestDashboard(), 5000),
      dashboardForm: FormBuilder.group({ intervalTime: 5000 })
    };
  }

  componentDidMount() {
    this.state.dashboardForm.get('intervalTime').valueChanges.subscribe((value) => {
      window.clearInterval(this.state.intervalInstance);

      this.setState({
        intervalTime: value,
        intervalInstance: window.setInterval(() => this.props.onRequestDashboard(), value)
      });
    });

    this.props.onRequestDashboard();
  }

  componentWillUnmount() {
    window.clearInterval(this.state.intervalInstance);
  }

  render() {
    const { dashboard } = this.props.incidentDashboard;
    return (
      <div className="dashboard">
        <div className="dashboard-beta">BETA</div>
        <FieldControlWrapper
          render={SelectInput}
          name="intervalTime"
          control={this.state.dashboardForm.get('intervalTime')}
          values={values}
        />
        <div className="dashboard-charts">
          <StatusChart data={dashboard.status} />
          <CategoryChart data={dashboard.category} />
          <TodayChart data={dashboard.today} />
          <HourChart data={dashboard.hour} />
        </div>
      </div>
    );
  }
}

Dashboard.defaultProps = {
  incidentDashboard: {
    dashboard: {}
  }
};

Dashboard.propTypes = {
  incidentDashboard: PropTypes.shape({
    dashboard: PropTypes.object
  }),
  onRequestDashboard: PropTypes.func.isRequired
};

const mapStateToProps = createStructuredSelector({
  incidentDashboard: makeSelectDashboard()
});

export const mapDispatchToProps = (dispatch) => bindActionCreators({
  onRequestDashboard: requestDashboard
}, dispatch);

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'incidentDashboard', reducer });
const withSaga = injectSaga({ key: 'incidentDashboard', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(Dashboard);
