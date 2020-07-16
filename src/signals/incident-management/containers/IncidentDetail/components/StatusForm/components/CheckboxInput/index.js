import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Label, themeSpacing } from '@datapunt/asc-ui';
import Checkbox from 'components/Checkbox';

const CheckboxStyle = styled.div`
  display: flex;
  margin-bottom: ${themeSpacing(4)};

  & > label > span {
    margin: 0;
  }
`;

const CheckboxInput = ({ name, label, ...rest }) => ({ handler }) => (
  <CheckboxStyle>
    <Checkbox id={name} name={name} checked={handler().value} onChange={handler().onChange} {...rest} />
    <Label htmlFor={name} label={label} />
  </CheckboxStyle>
);

CheckboxInput.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
};

export default CheckboxInput;
