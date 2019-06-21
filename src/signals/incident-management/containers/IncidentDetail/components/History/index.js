import React from 'react';
import PropTypes from 'prop-types';

import { string2date, string2time } from 'shared/services/string-parser/string-parser';

import './style.scss';

const History = ({ list }) => (
  <section className="history">
    <h4>Historie</h4>

    {list.map((item) => (
      <div key={item.identifier} className="row history__item">
        <div className="col-5 history__item-left">
          {string2date(item.when)} om {string2time(item.when)}
          <div>{item.who}</div>
        </div>
        <div className="col-7 history__item-right pre-wrap">
          <div>{item.action}</div>
          <div>{item.description}</div>
        </div>
      </div>
    ))}
  </section>
);

History.propTypes = {
  list: PropTypes.array.isRequired
};

export default History;
