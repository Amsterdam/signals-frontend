// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import React, { useContext } from 'react';
import styled from 'styled-components';
import { Link, themeSpacing } from '@amsterdam/asc-ui';
import ContainerSelectContext from 'signals/incident/components/form/ContainerSelect/context';
import ContainerList from '../ContainerList/ContainerList';

const Wrapper = styled.div`
  position: relative;
`;

const StyledLink = styled(Link)`
  text-decoration: underline;
  font-size: 16px;
  cursor: pointer;
`;

const StyledContainerList = styled(ContainerList)`
  margin-bottom: ${themeSpacing(1)};
`;

const Summary = () => {
  const { selection, meta, edit } = useContext(ContainerSelectContext);

  return (
    <Wrapper data-testid="containerSelectSummary">
      <StyledContainerList selection={selection} featureTypes={meta.featureTypes}></StyledContainerList>
      <StyledLink onClick={edit} variant="inline" tabIndex={0}>
        Wijzigen
      </StyledLink>
    </Wrapper>
  );
};

export default Summary;
