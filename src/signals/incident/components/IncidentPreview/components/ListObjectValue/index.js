import PropTypes from 'prop-types';
import React from 'react';
import './style.scss';

const ListObjectValue = ({ label, value }) => (
  <div className="list-object-value">
    <div className="row">
      <div className="col-5 col-md-4">
        <div className="list-object-value__item-label">{label}</div>
      </div>
      <div className="col-5 col-md-7">
        <ul className="list-object-value__item-value">
          { value.map((item) => <li key={item.label}>{item.label}</li>) }
        </ul>
      </div>
    </div>
  </div>
);

ListObjectValue.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.array.isRequired
};

export default ListObjectValue;
