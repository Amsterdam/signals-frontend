import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import map from 'lodash.map';

import Input from 'components/Input';
import Button from 'components/Button';

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

  if (!fields.length) {
    fields.push('');
  }

  fields.push('');
  parent.meta.updateIncident({ [meta.name]: fields });
}

const StyledInput = styled(Input)`
  margin-bottom: 8px;
  width: 25%;
  min-width: 175px;
`;

/**
 * Multiple text input fields.
 * Text input is only for limited character set (see pattern and filterInvalidKeys handler).
 */
const MultiTextInput = ({ handler, touched, hasError, meta, parent, getError, validatorsOrOpts }) => meta?.isVisible && (
  <Header meta={meta} options={validatorsOrOpts} touched={touched} hasError={hasError} getError={getError}>
    <input type="hidden" {...handler()} />

    {map(handler().value || [''], (input, index) => (
      <div key={`${meta.name}-${index + 1}`}>
        <StyledInput
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

    <Button onClick={() => addItem(handler().value, meta, parent)} variant="textButton">
      {meta.newItemText}
    </Button>
  </Header>
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
