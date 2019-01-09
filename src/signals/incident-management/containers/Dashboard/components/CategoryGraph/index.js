import React from 'react';
import PropTypes from 'prop-types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, LabelList } from 'recharts';

import './style.scss';

const CategoryGraph = ({ data }) => (
  <div className="category-graph">
    <BarChart
      layout="vertical"
      width={800}
      height={460}
      data={data}
    >
      <XAxis
        type="number"
        dataKey="value"
        axisLine={false}
        tick={false}
      />
      <YAxis
        type="category"
        dataKey="name"
        axisLine={false}
        tickLine={false}
      />

      <Tooltip />
      <Bar dataKey="value" fill="#23B0C3"><LabelList dataKey="value" position="right" /></Bar>
    </BarChart>
  </div>
  );

CategoryGraph.defaultProps = {
  data: []
};

CategoryGraph.propTypes = {
  data: PropTypes.array
};

export default CategoryGraph;
