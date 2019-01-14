import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';


import './style.scss';

const TodayChart = ({ data }) => (
  <div className="today-chart">
    <div className="today-chart_date">{moment().format('dddd D MMMM YYYY')}</div>
    <div className="today-chart_count">{data.count}</div>
  </div>
);


TodayChart.defaultProps = {
  data: {}
};

TodayChart.propTypes = {
  data: PropTypes.object
};

export default TodayChart;
