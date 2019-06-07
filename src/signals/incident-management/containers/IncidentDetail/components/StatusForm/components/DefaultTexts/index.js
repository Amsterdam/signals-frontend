import React from 'react';
import PropTypes from 'prop-types';


import './style.scss';

const DefaultTexts = ({ defaultTexts, state }) => (
  <div className="default-texts">
    def text
    {defaultTexts.map((text) => (
      <div key={text.pk}>
        {text.state === state ?
          <div>
            <div>{text.title}</div>
            <div>{text.text}</div>
          </div>
          : ''}
      </div>
    ))}
  </div>
);

DefaultTexts.propTypes = {
  defaultTexts: PropTypes.array.isRequired,
  state: PropTypes.string.isRequired,
};

export default DefaultTexts;
