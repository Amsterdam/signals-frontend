import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';
import sortBy from 'lodash.sortby';
import styled from 'styled-components';
import {
  FieldControl,
  FormControl,
  FormGroup,
  FormArray,
} from 'react-reactive-form';

const FieldControlContainer = styled.div`
  break-inside: avoid;
`;

const formatValues = props => {
  if (props.values?.find(value => value.key === '')) {
    return props.values;
  }

  return props.sort ?
    sortBy(props.values, item => item.value || item.name) :
    props.values;
};

class FieldControlWrapper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      values: formatValues(props),
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (!isEqual(props.values, state.values)) {
      return {
        values: formatValues(props),
      };
    }

    return null;
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(this.props.values, prevProps.values)) {
      this.props.control.updateValueAndValidity();
    }
  }

  render() {
    const {
      name, control, render, meta, parent, ...props
    } = this.props;

    return (
      <FieldControlContainer>
        <FieldControl
          name={name}
          control={control}
          meta={meta}
          parent={parent}
          render={render({
            ...props,
            values: this.state.values,
            name,
          })}
        />
      </FieldControlContainer>
    );
  }
}

FieldControlWrapper.defaultProps = {
  emptyOptionText: '',
  values: [],
};

FieldControlWrapper.propTypes = {
  /** Element containing the value of the current field */
  control: PropTypes.instanceOf(FormControl).isRequired,
  emptyOptionText: PropTypes.string,
  /** Object containing custom data or handlers */
  meta: PropTypes.shape({}),
  /** Name of the form element */
  name: PropTypes.string.isRequired,
  /** Parent element that the current control needs to report to */
  parent: PropTypes.oneOfType([FormGroup, FormArray]),
  /** Component that needs to be rendered */
  render: PropTypes.func.isRequired,
  /** Form values */
  values: PropTypes.arrayOf(PropTypes.shape({})),
};

export default FieldControlWrapper;
