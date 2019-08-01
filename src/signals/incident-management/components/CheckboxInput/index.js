import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Label from '../Label';

const CheckboxInput = ({
  name,
  display,
  values,
  toggleChecked,
  allChecked,
  hasToggleAll,
  toggleLabel,
}) => {
  const render = ({ handler }) => {
    const inputValues = handler().value || [];
    debugger;

    return (
      <Fragment key={Math.random()}>
        {display && <Label htmlFor={`${name}-${values[0].key}`}>{display}</Label>}

        {hasToggleAll && toggleLabel && (
          <button type="button" onClick={toggleChecked}>
            {toggleLabel}
          </button>
        )}

        {values.map(({ key, value }) => (
          <div className="antwoord" key={key}>
            <input
              id={`${name}-${key}`}
              name={name}
              defaultChecked={allChecked || inputValues.includes(key)}
              type="checkbox"
              value={key}
            />
            <label htmlFor={`${name}-${key}`}>{value}</label>
          </div>
        ))}
      </Fragment>
    );
  };

  render.defaultProps = {
    touched: false,
  };

  render.propTypes = {
    handler: PropTypes.func.isRequired,
  };

  return render;
};

CheckboxInput.defaultProps = {
  hasToggleAll: true,
  toggleLabel: '',
};

CheckboxInput.propTypes = {
  /** When provided, will render a <label> element with the for attribute pointing to the first selectable element in the list */
  display: PropTypes.string,
  /** When true, will render a toggle that (de)selects all checkboxes */
  hasToggleAll: PropTypes.bool,
  /** Name of the group of elements  */
  name: PropTypes.string.isRequired,
  /** Flag indicating if all boxes should be checked or not */
  toggleChecked: PropTypes.bool,
  /** Element to show as select-all toggle label */
  toggleLabel: PropTypes.node,
  values: PropTypes.shape({
    key: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  }).isRequired,
};

export default CheckboxInput;
