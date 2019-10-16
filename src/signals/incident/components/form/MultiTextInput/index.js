import React from 'react';
import PropTypes from 'prop-types';
import map from 'lodash.map';
import { Input } from '@datapunt/asc-ui';

import './style.scss';

import Header from '../Header';

const allowedChars = /[0-9.,;]+/;

const filterInvalidKeys = event => {
  if (!allowedChars.test(event.key)) {
    // Swallow invalid character inputs.
    event.preventDefault();
  }
};

function updateIncident(value, index, oldFields, meta, parent) {
  const fields = [...oldFields];
  fields[index] = value;

  parent.meta.updateIncident({ [meta.name]: fields });
}

function addItem(oldFields, meta, parent) {
  const fields = [...oldFields];
  fields.push('');
  parent.meta.updateIncident({ [meta.name]: fields });
}

/**
 * Multiple text input fields.
 * Text input is only for limited character set (see pattern and filterInvalidKeys handler).
 */
const MultiTextInput = ({
  handler, touched, hasError, meta, parent, getError, validatorsOrOpts,
}) => (
  <div className={`multi-text-input ${meta && meta.isVisible ? 'row' : ''}`}>
    {meta && meta.isVisible
      ? (
        <div className={`${meta.className || 'col-12'} mode_input`}>
          <Header
            meta={meta}
            options={validatorsOrOpts}
            touched={touched}
            hasError={hasError}
            getError={getError}
          >
            <div>
              <input
                type="hidden"
                {...handler()}
              />

              {map(handler().value || [''], (input, index) => (
                <div key={`${meta.name}-${index + 1}`}>
                  <Input
                    className={`multi-text-input__input ${meta.itemClassName ? meta.itemClassName : ''}`}
                    id={`${meta.name}-${index + 1}`}
                    name={`${meta.name}-${index + 1}`}
                    type="text"
                    placeholder={meta.placeholder}
                    value={input}
                    onChange={e => updateIncident(e.target.value, index, handler().value, meta, parent)}
                    onKeyPress={e => filterInvalidKeys(e)}
                    pattern="[0-9.,;]+"
                    maxLength="15"
                  />
                </div>
              ))}

              <button className="multi-text-input__button" onClick={() => addItem(handler().value, meta, parent)} type="button">{meta.newItemText}</button>
            </div>
          </Header>
        </div>
      )
      : ''}
  </div>
);

MultiTextInput.propTypes = {
  handler: PropTypes.func,
  touched: PropTypes.bool,
  getError: PropTypes.func,
  hasError: PropTypes.func,
  meta: PropTypes.object,
  parent: PropTypes.object,
  validatorsOrOpts: PropTypes.object,
};

export default MultiTextInput;
