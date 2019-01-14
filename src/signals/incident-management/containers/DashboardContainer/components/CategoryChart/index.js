import React from 'react';
import PropTypes from 'prop-types';
import { BarChart, Bar, XAxis, YAxis, LabelList } from 'recharts';

import './style.scss';

const CategoryChart = ({ data }) => (
  <div className="category-chart">
    <h3>Per rubriek</h3>

    <BarChart
      layout="vertical"
      width={582}
      height={460}
      data={data}
      margin={{ right: 20 }}
    >
      <XAxis
        type="number"
        dataKey="count"
        axisLine={false}
        tick={false}
      />
      <YAxis
        type="category"
        dataKey="name"
        width={200}
        axisLine={false}
        tickLine={false}
      />

      <Bar
        dataKey="count"
        animationDuration={300}
        fill="#23B0C3"
      ><LabelList dataKey="count" position="right" /></Bar>
    </BarChart>
  </div>
  );

CategoryChart.defaultProps = {
  data: []
};

CategoryChart.propTypes = {
  data: PropTypes.array
};

export default CategoryChart;
