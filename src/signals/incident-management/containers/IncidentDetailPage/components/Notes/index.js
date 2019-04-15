import React from 'react';
import PropTypes from 'prop-types';

import { string2date, string2time } from 'shared/services/string-parser/string-parser';

import './style.scss';

const Notes = ({ list }) => (
  <section className="notes">
    {list.map((item) => (
      <div key={item._links.self.href} className="notes__item">
        <div className="notes__item-header">
          <span className="notes__item-header-when">{string2date(item.created_at)}</span>
          <span className="notes__item-header-when">{string2time(item.created_at)}</span>
          {item.created_by}
        </div>
        <div className="notes__item-body pre-wrap">{item.text}</div>
      </div>
    ))}
  </section>
);

Notes.propTypes = {
  list: PropTypes.array.isRequired
};

export default Notes;
