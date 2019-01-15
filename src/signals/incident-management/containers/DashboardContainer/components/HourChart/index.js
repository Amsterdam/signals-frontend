import React from 'react';
import PropTypes from 'prop-types';
import { LineChart, Line, XAxis, YAxis, LabelList } from 'recharts';
import moment from 'moment';

import './style.scss';

const HourChart = ({ data }) => (
  <div className="hour-chart">
    <h3>Meldingen per uur</h3>

    <LineChart
      width={643}
      height={400}
      data={data}
      margin={{ top: 20, right: 20, left: 20 }}
    >
      <XAxis
        tickFormatter={(tick) => moment(tick).format('HH')}
        domain={['dataMin', 'dataMax']}
        type="number"
        scale="time"
        dataKey="timestamp"
        tickCount={data.length}
      />
      <YAxis
        hide
        type="number"
        dataKey="count"
      />

      <Line
        type="linear"
        dataKey="count"
        animationDuration={300}
        stroke="#23B0C3"
        strokeWidth={3}
        dot={{ strokeWidth: 5 }}
      ><LabelList dataKey="count" position="top" offset={12} /></Line>
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
