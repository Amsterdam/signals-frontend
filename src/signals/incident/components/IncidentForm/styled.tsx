import styled from 'styled-components'

export const Form = styled.form`
  width: 100%;
`

export const ProgressContainer = styled.div``

export const Fieldset = styled.fieldset<{ isSummary?: boolean }>`
  border: 0;
  padding: 0;
  margin: 0;
  word-break: normal;
  display: grid;
  row-gap: 32px;
`
