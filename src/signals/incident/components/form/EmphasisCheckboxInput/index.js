// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2022 Gemeente Amsterdam
import { themeColor, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

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
const EmphasisCheckboxInput = (props) => {
  return (
    <Emphasis>
      <CheckboxInput {...props} />
    </Emphasis>
  )
}
export default EmphasisCheckboxInput
