import React from 'react';
import { PieChart, Pie, Tooltip, Legend } from 'recharts';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectDashboard from './selectors';
import reducer from './reducer';
import saga from './saga';
import './style.scss';

import { requestDashboard } from './actions';

export class Dashboard extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    this.props.onRequestDashboard();
  }

  render() {
    const { dashboard } = this.props.incidentDashboard;
    return (
      <div className="dashboard">
        <PieChart width={730} height={450}>
          <Tooltip />
          <Legend />
          <Pie data={dashboard.pie1 || []} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" />
          <Pie data={dashboard.pie2 || []} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={120} outerRadius={200} fill="#82ca9d" label />
        </PieChart>
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
