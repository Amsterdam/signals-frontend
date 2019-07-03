import React from 'react';
import PropTypes from 'prop-types';
import map from 'lodash.map';
import get from 'lodash.get';
import { injectIntl } from 'react-intl';
import isObject from 'lodash.isobject';

import Header from '../Header/';
import formatIncidentMessage from '../../../services/format-incident-message';

const renderOption = (intl, key, name, value, handler, parent) => {
  const id = `${name}-${key + 1}`;

  const incident = get(parent, 'meta.incident', {});
  const label = formatIncidentMessage(intl, value, incident);

  return (
    <div className="antwoord" key={key}>
      <input
        id={id}
        className="kenmerkradio"
        type="radio"
        checked={handler().value.id === key}
        onChange={() => parent.meta.updateIncident({ [name]: {
          id: key,
          label
        } })}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
};

const RadioInput = ({ handler, touched, hasError, meta = {}, parent, getError, validatorsOrOpts, intl }) => {
  const { className, isVisible, name, values } = meta;
  return (
    <div className={`${isVisible ? 'row' : ''}`}>
      {isVisible ?
        <div className={`${className || 'col-12'} mode_input`}>
          <Header
            meta={meta}
            options={validatorsOrOpts}
            touched={touched}
            hasError={hasError}
            getError={getError}
            parent={parent}
          >
            <div className="antwoorden">
              {values && isObject(values) && map(values, (value, key) => (
                renderOption(intl, key, name, value, handler, parent)
              ))}
            </div>
          </Header>
        </div>
        : ''}
    </div>
  );
};

RadioInput.propTypes = {
  handler: PropTypes.func,
  touched: PropTypes.bool,
  getError: PropTypes.func.isRequired,
  hasError: PropTypes.func.isRequired,
  meta: PropTypes.object,
  parent: PropTypes.object,
  validatorsOrOpts: PropTypes.object
};

/**
 * Wraps React class component inside function because react-reactive-forms doesn't seem to handle class components
 * in our use case.
 */
const FunctionWrappedComponent = (props) => {
  const IntlProvider = injectIntl(RadioInput);
  return <IntlProvider {...props} parent={props.parent} />;
};

export default FunctionWrappedComponent;
