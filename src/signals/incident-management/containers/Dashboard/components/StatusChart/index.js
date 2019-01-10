/* eslint-disable */

import React from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

import './style.scss';

const RADIAN = Math.PI / 180;

function renderCustomizedLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) {
 	const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x  = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy  + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" 	dominantBaseline="central">
    	{`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

const StatusChart = ({ data }) => (
  <div className="status-chart">
    <h3>Per status</h3>

    <PieChart width={400} height={460}>
      <Tooltip />
      <Legend />
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        startAngle={90}
        endAngle={-270}
        innerRadius={35}
        outerRadius={170}
        legendType="circle"
        label={renderCustomizedLabel}
        labelLine={false}
      >{data.map((entry, index) => <Cell key={index} fill={entry.color} />)}</Pie>
    </PieChart>
  </div>
  );

StatusChart.defaultProps = {
  data: []
};

StatusChart.propTypes = {
  data: PropTypes.array
};

export default StatusChart;
