import { themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import Label from 'components/Label'

export const StyledLabel = styled(Label)`
  margin-bottom: 0;
  line-height: ${themeSpacing(6)};
`

export const Info = styled.span`
  margin: ${themeSpacing(0, 4, 0, 2)};
`

export const FieldWrapper = styled.div`
  width: 240px; /* fixed value from design */

  & > div:last-child {
    margin-top: ${themeSpacing(3)};
  }
`

export const TimeFieldset = styled.fieldset`
  border: 0;
  padding: 0;
  margin-top: ${themeSpacing(7)};

  & > legend {
    border: 0;
    padding: 0;
  }
`

export const TimeWrapper = styled.div`
  display: flex;
  align-items: flex-end;

  & > div:first-child > div:last-child {
    margin-top: ${themeSpacing(3)};
  }

  select {
    width: 75px; /* fixed value from design */
  }
`
