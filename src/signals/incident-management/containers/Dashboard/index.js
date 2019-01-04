import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
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
        <LineChart width={600} height={300} data={(dashboard) || []} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
        </LineChart>
      </div>
    );
  }
}

Dashboard.defaultProps = {
  incidentDashboard: {
    dashboard: []
  }
};

Dashboard.propTypes = {
  incidentDashboard: PropTypes.shape({
    dashboard: PropTypes.array
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
