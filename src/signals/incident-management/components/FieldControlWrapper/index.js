import React from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';

import { FieldControl } from 'react-reactive-form';

export class FieldControlWrapper extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.state = {
      values: props.values
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (isEqual(props.values, state.values)) {
      return {
        values: props.emptyOptionText ? [{ key: '', value: props.emptyOptionText }, ...props.values] : props.values,
      };
    }

    return null;
  }

  render() {
    const { name, control, render, ...props } = this.props;
    return (
      <div>
        <FieldControl
          name={name}
          control={control}
          render={render({
            ...props,
            values: this.state.values,
            name
          })}
        />
      </div>);
  }
}

FieldControlWrapper.defaultProps = {
  values: []
};

FieldControlWrapper.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired,
  values: PropTypes.array,
  render: PropTypes.func.isRequired
};

export default FieldControlWrapper;
