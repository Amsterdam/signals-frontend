import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { themeColor, themeSpacing } from '@datapunt/asc-ui';
import { FormGroup } from 'react-reactive-form';

import CheckboxInput from '../CheckboxInput';

const Emphasis = styled.div`
  background-color: ${themeColor('tint', 'level3')};
  padding: ${themeSpacing(4, 4, 5, 4)};

  .checkboxWrapper {
    display: flex;
    align-items: flex-start;

    * {
      margin: 0;
    }
  }
`;

const EmphasisCheckboxInput = props => (
  <Emphasis>
    <CheckboxInput {...props} parent={props._parent} />
  </Emphasis>
);

EmphasisCheckboxInput.propTypes = {
  /**
   * Each form control in react-reactive-form expects to get a 'parent' prop. This prop isn't passed on when
   * rendering a form control component in another component. The '_parent' prop needs to be passed through
   * as 'parent' prop to make the damn thing work.
   */
  _parent: PropTypes.objectOf(FormGroup).isRequired,
};

export default EmphasisCheckboxInput;
