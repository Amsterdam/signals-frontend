// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 - 2022 Gemeente Amsterdam
import type { FC, ReactNode } from 'react'

import { Label, Spinner, themeColor } from '@amsterdam/asc-ui'
import styled from 'styled-components'

const Container = styled.div`
  align-items: center;
  border: 1px dashed #767676;
  display: flex;
  font-size: 1rem;
  height: 100%;
  max-width: 420px;
  padding: 8px 12px;
  width: 100%;
`

const StyledLabel = styled(Label)`
  padding-bottom: 8px;
  line-height: 25px;

  & > * {
    margin: 0;
  }
`

type SelectLoaderProps = {
  className?: string
  label?: ReactNode
}

const SelectLoader: FC<SelectLoaderProps> = ({ className, label }) => (
  <div data-testid="selectLoader">
    {label && <StyledLabel label={label} />}
    <Container className={className}>
      <Spinner color={themeColor('secondary')} />
    </Container>
  </div>
)

SelectLoader.defaultProps = {
  className: '',
}

export default SelectLoader
