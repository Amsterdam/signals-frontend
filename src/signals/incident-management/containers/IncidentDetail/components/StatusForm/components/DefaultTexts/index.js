import React from 'react';
import PropTypes from 'prop-types';


import './style.scss';

const DefaultTexts = ({ defaultTexts, state, onHandleUseDefaultText }) => {
  const showTexts = defaultTexts.find((text) => text.state === state) && ['o', 'ingepland'].includes(state) && defaultTexts && defaultTexts.length;
  return (
    <div className="default-texts">
      {showTexts ?
        <div>
          <h4>Standaard teksten</h4>

          {defaultTexts.map((text) => (
            <div key={text.pk}>
              {text.state === state && text.text ?
                <div className="default-texts__wrapper">
                  <div className="default-texts__title">{text.title}</div>
                  <div className="default-texts__text">{text.text}</div>

                  <button
                    className="default-texts__button"
                    onClick={(e) => onHandleUseDefaultText(e, text.pk)}
                  >Gebruik deze tekst</button>
                </div>
            : ''}
            </div>
          ))}
        </div>
      : ''}
    </div>
  );
};

DefaultTexts.propTypes = {
  defaultTexts: PropTypes.array.isRequired,
  state: PropTypes.string.isRequired,

  onHandleUseDefaultText: PropTypes.func.isRequired
};

export default DefaultTexts;
