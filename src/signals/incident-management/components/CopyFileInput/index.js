import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

export const CopyFileInput = (props) => {
  const { name, display, values } = props;
  const render = ({ handler }) => (
    <div className="copy-file-input">
      <div className="mode_input text rij_verplicht">
        <div className="copy-file-input__label">
          <label htmlFor={`form${name}`}>{display}</label>
        </div>

        {values.map((attachment) => (
          <div
            key={attachment.location}
            className="copy-file-input__attachment"
            style={{ backgroundImage: `url(${attachment.location})` }}
          />
        ))}

        <div className="copy-file-input__control invoer antwoord">
          <input name="" id={`form${name}`} type="checkbox" {...handler('checkbox')} />
          <label htmlFor={`form${name}`}>Foto&squo;s toevoegen</label>
        </div>
      </div>
    </div>);

  render.defaultProps = {
    touched: false,
    values: []
  };

  render.propTypes = {
    handler: PropTypes.func.isRequired,
    values: PropTypes.array
  };
  return render;
};

export default CopyFileInput;
