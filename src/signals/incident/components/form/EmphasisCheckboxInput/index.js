// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import styled from 'styled-components'
import { themeColor, themeSpacing } from '@amsterdam/asc-ui'
import CheckboxInput from '../CheckboxInput'

const Emphasis = styled.div`
  background-color: ${themeColor('tint', 'level3')};
  padding: ${themeSpacing(4, 4, 5, 3)};

  label {
    display: flex;
    align-items: flex-start;

    & > * {
      margin: 0;
    }
  }
`
/**
 * Each form control in react-reactive-form expects to get a 'parent' prop. This prop isn't passed on when
 * rendering a form control component in another component. The '_parent' prop needs to be passed through
 * as 'parent' prop to make the damn thing work.
 */
const EmphasisCheckboxInput = (props) => (
  <Emphasis>
    <CheckboxInput {...props} parent={props?._parent} />
  </Emphasis>
)

export default EmphasisCheckboxInput
