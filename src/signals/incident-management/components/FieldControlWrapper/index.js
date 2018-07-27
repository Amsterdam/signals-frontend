import React from 'react';
import PropTypes from 'prop-types';

import { FieldControl } from 'react-reactive-form';

const FieldControlWrapper = ({ name, control, render, ...props }) => (
  <div>
    <FieldControl name={name} control={control} render={render(props)} />
  </div>);

FieldControlWrapper.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired,
  render: PropTypes.func.isRequired,
};

export default FieldControlWrapper;
