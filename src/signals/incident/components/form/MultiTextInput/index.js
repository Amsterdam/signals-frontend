import React from 'react';
import PropTypes from 'prop-types';
import map from 'lodash.map';
// import isObject from 'lodash.isobject';

import './style.scss';

import Header from '../Header';

function updateIncident(value, key, oldFields, meta, parent) {
  const fields = [...oldFields];
  fields[key] = {
    id: `${meta.name}-${key + 1}`,
    label: value
  };

  parent.meta.updateIncident({ [meta.name]: fields });
}

function addItem(fields, meta, parent) {
  fields.push({ id: `${meta.name}-${fields.length + 1}`, label: '' });
  parent.meta.updateIncident({ [meta.name]: fields });
}

const MultiTextInput = ({ handler, touched, hasError, meta, parent, getError, validatorsOrOpts }) => (
  <div className={`multi-text-input ${meta && meta.isVisible ? 'row' : ''}`}>
    {meta && meta.isVisible ?
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

            {map(handler().value || [{ id: `${meta.name}-1`, label: '' }], (input, key) =>
              (<div key={`${meta.name}-${key + 1}`} className="invoer">
                <input
                  className={`multi-text-input__input ${meta.itemClassName ? meta.itemClassName : ''}`}
                  id={`${meta.name}-${key + 1}`}
                  name={`${meta.name}-${key + 1}`}
                  type="text"
                  placeholder={meta.placeholder}
                  value={input.label}
                  defaultChecked={(handler().value || []).find((item) => item.id === key)}
                  onChange={(e) => updateIncident(e.target.value, key, handler().value, meta, parent)}
                />
              </div>)
            )}

            <button className="multi-text-input__button" onClick={() => addItem(handler().value, meta, parent)} >{meta.newItemText}</button>
          </div>
        </Header>
      </div>
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
  validatorsOrOpts: PropTypes.object
};

export default MultiTextInput;
