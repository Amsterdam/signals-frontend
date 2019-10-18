/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';

import { defaultTextsType } from 'shared/types';

import './style.scss';

const DefaultTexts = ({ defaultTexts, status, onHandleUseDefaultText }) => {
  const allText = (defaultTexts && defaultTexts.length && defaultTexts.find(text => text.state === status));
  const showTexts = allText && ['o', 'ingepland'].includes(status);

  return (
    <div className="default-texts">
      {showTexts
        ? (
          <div>
            <h4 data-testid="default-texts-title">Standaard teksten</h4>

            {showTexts && allText.templates.map((item, index) => (
              <div key={index}>
                <div className="default-texts__wrapper" data-testid="default-texts-item">
                  <div className="default-texts__title" data-testid="default-texts-item-title">{item.title}</div>
                  <div className="default-texts__text" data-testid="default-texts-item-text">{item.text}</div>

                  <button
                    className="default-texts__button"
                    type="button"
                    data-testid="default-texts-item-button"
                    onClick={e => onHandleUseDefaultText(e, item.text)}
                  >
Gebruik deze tekst
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
        : ''}
    </div>
  );
};

DefaultTexts.propTypes = {
  defaultTexts: defaultTextsType.isRequired,
  status: PropTypes.string.isRequired,

  onHandleUseDefaultText: PropTypes.func.isRequired,
};

export default DefaultTexts;
