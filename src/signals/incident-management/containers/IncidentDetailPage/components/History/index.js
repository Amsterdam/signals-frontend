import React from 'react';
import PropTypes from 'prop-types';

import { string2date, string2time } from 'shared/services/string-parser/string-parser';

import './style.scss';

const History = ({ list }) => (
  <section className="history">
    {list.map((item) => (
      <div key={item.identifier} className="history__item">
        <div className="history__item-header">
          <span className="history__item-header-when">{string2date(item.when)}</span>
          <span className="history__item-header-when">{string2time(item.when)}</span>
          {item.who}
        </div>
        <div className="history__item-action">{item.action}</div>
        <div className="history__item-description pre-wrap">{item.description}</div>
      </div>
    ))}
  </section>
);

History.propTypes = {
  list: PropTypes.array.isRequired
};

export default History;
