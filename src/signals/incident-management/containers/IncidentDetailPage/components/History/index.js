import React from 'react';
import PropTypes from 'prop-types';


import './style.scss';

const History = ({ list }) => (
  <section className="history">
    {console.log('i', list)}
    {list.map((item) => (
      <div key={item.identifier} className="history__item">
        <div className="history__item-when">{item.when}</div>
        <div className="history__item-who">{item.who}</div>
        <div className="history__item-action">{item.action}</div>
        <div className="history__item-description">{item.description}</div>
      </div>
    ))}
  </section>
);

History.propTypes = {
  list: PropTypes.array.isRequired
};

export default History;
