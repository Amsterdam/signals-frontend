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
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} 	dominantBaseline="central">
    	{`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

const StatusChart = ({ data }) => (
  <div className="status-graph">
    <PieChart width={460} height={460}>
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
        label={renderCustomizedLabel}
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
