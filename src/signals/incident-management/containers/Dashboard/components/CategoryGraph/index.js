import React from 'react';
import PropTypes from 'prop-types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, LabelList } from 'recharts';

import './style.scss';

// const CustomLabel = (props) => {
  // console.log('props', props);
  // return (<text width={200}></text>);
// };

const CategoryGraph = ({ data }) => (
  <div className="category-graph">
    <BarChart
      layout="vertical"
      width={800}
      height={460}
      data={data}
    >
      <XAxis type="number" />
      <YAxis type="category" dataKey="name" />
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
