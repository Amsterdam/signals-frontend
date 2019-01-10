import React from 'react';
import PropTypes from 'prop-types';
import { LineChart, Line, XAxis, YAxis, LabelList } from 'recharts';

import './style.scss';

const HourChart = ({ data }) => (
  <div className="category-graph">
    <LineChart
      width={1000}
      height={460}
      data={data}
      margin={{ top: 20 }}
    >
      <XAxis
        type="number"
        dataKey="hour"
        axisLine={false}
        tickLine={false}
        tickCount={13}
      />
      <YAxis
        type="number"
        dataKey="value"
        axisLine={false}
        tick={false}
      />

      <Line type="linear" dataKey="value" stroke="#23B0C3" strokeWidth={3} dot={{ strokeWidth: 5 }}><LabelList dataKey="value" position="top" offset={12} /></Line>
    </LineChart>
  </div>
  );

HourChart.defaultProps = {
  data: []
};

HourChart.propTypes = {
  data: PropTypes.array
};

export default HourChart;
