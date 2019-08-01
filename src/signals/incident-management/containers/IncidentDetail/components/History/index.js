import React from 'react';
import PropTypes from 'prop-types';

import { string2date, string2time } from 'shared/services/string-parser/string-parser';

import './style.scss';

const History = ({ list }) => (
  <section className="history">
    <h4 data-testid="history-title">Historie</h4>

    {list.map((item) => (
      <div key={item.identifier} className="row history__item" data-testid="history-list-item">
        <div className="col-5 history__item-left">
          <span data-testid="history-list-item-when">{string2date(item.when)} om {string2time(item.when)}</span>
          <div data-testid="history-list-item-who">{item.who}</div>
        </div>
        <div className="col-7 history__item-right pre-wrap">
          <div data-testid="history-list-item-action">{item.action}</div>
          <div data-testid="history-list-item-description">{item.description}</div>
        </div>
      </div>
    ))}
  </section>
);

History.propTypes = {
  list: PropTypes.array.isRequired
};

export default History;
