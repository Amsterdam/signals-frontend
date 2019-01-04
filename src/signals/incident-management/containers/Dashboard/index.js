import React from 'react';
import { PieChart, Pie, Tooltip, Legend, LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
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

    const data = [
      { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
      { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
      { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
      { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
      { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
      { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 }
    ];

    return (
      <div className="dashboard">
        <PieChart width={730} height={500}>
          <Tooltip />
          <Legend />
          <Pie data={dashboard.pie1 || []} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" />
          <Pie data={dashboard.pie2 || []} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={120} outerRadius={200} fill="#82ca9d" label />
        </PieChart>

        <LineChart width={730} height={250} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
        </LineChart>
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
