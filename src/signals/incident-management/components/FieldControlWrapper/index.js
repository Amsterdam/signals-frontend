import React from 'react';
import PropTypes from 'prop-types';
import { isEqual, sortBy } from 'lodash';

import { FieldControl } from 'react-reactive-form';

export class FieldControlWrapper extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static addEmptyOption(props, state) {
    const values = (props && props.values) || (state && state.values);
    if (values.find((value) => value.key === '')) {
      return values;
    }
    const sortedValues = props.sort ? sortBy(props.values, (item) => item.value) : props.values;
    return props.emptyOptionText ? [{ key: '', value: props.emptyOptionText }, ...sortedValues] : sortedValues;
  }

  constructor(props) {
    super(props);

    this.state = {
      values: FieldControlWrapper.addEmptyOption(props)
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (!isEqual(props.values, state.values)) {
      return {
        values: FieldControlWrapper.addEmptyOption(props, state)
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
  emptyOptionText: '',
  values: []
};

FieldControlWrapper.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired,
  render: PropTypes.func.isRequired,
};

export default FieldControlWrapper;
