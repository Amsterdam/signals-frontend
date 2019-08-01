import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';
import sortBy from 'lodash.sortby';
import styled from 'styled-components';
import { FieldControl, FormControl } from 'react-reactive-form';

const FieldControlContainer = styled.div`
  break-inside: avoid;
  margin-bottom: 30px;
`;

export class FieldControlWrapper extends React.Component {
  static formatValues(props) {
    if (props.values.find((value) => value.key === '')) {
      return props.values;
    }
    const sortedValues = props.sort
      ? sortBy(props.values, (item) => item.value)
      : props.values;

    return props.emptyOptionText
      ? [{ key: '', value: props.emptyOptionText, slug: '' }, ...sortedValues]
      : sortedValues;
  }

  constructor(props) {
    super(props);

    this.state = {
      allChecked: false,
      values: FieldControlWrapper.formatValues(props),
    };

    this.toggleChecked = this.toggleChecked.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    if (!isEqual(props.values, state.values)) {
      return {
        values: FieldControlWrapper.formatValues(props),
      };
    }

    return null;
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(this.props.values, prevProps.values)) {
      this.props.control.updateValueAndValidity();
    }
  }

  toggleChecked() {
    this.setState((state) => ({
      allChecked: !state.allChecked,
    }));
  }

  render() {
    const { name, control, render, meta, strict, ...props } = this.props;
    const { allChecked } = this.state;

    return (
      <FieldControlContainer>
        <FieldControl
          name={name}
          control={control}
          meta={meta}
          strict={strict}
          render={render({
            ...props,
            values: this.state.values,
            name,
            allChecked,
            toggleChecked: this.toggleChecked,
          })}
        />
      </FieldControlContainer>
    );
  }
}

FieldControlWrapper.defaultProps = {
  emptyOptionText: '',
  hasToggleAll: false,
  values: [],
};

FieldControlWrapper.propTypes = {
  /** Element containing the value of the current field */
  control: PropTypes.instanceOf(FormControl).isRequired,
  /** Object containing custom data or handlers */
  meta: PropTypes.shape({}),
  /** Name of the form element */
  name: PropTypes.string.isRequired,
  /** Component that needs to be rendered */
  render: PropTypes.func.isRequired,
  /** When true, will update component when props are updated */
  strict: PropTypes.bool,
  /** Form values */
  values: PropTypes.arrayOf(PropTypes.shape({})),
};

export default FieldControlWrapper;
