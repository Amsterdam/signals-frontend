// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam

import {Column, themeSpacing} from "@amsterdam/asc-ui";
import styled from "styled-components";

export const StyledColumn = styled(Column)`
  height: 100%;
  border-bottom: 2px solid;
  padding-bottom: ${themeSpacing(8)};

  @media (max-width: ${({ theme }) => theme.layouts.large.min}px) {
    margin-bottom: ${themeSpacing(8)};
  }
`
