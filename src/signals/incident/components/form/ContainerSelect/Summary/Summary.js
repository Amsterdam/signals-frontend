import React, { useContext } from 'react';
import styled from 'styled-components';
import { Link } from '@amsterdam/asc-ui';
import ContainerSelectContext from '../ContainerSelectContext';
import ContainerList from '../ContainerList';

const Wrapper = styled.div`
  position: relative;
`;

const StyledLink = styled(Link)`
  text-decoration: underline;
  font-size: 16px;
  cursor: pointer;
`;

const Summary = () => {
  const { selection, edit } = useContext(ContainerSelectContext);

  return (
    <Wrapper data-testid="containerSelectSummary">
      <ContainerList selection={selection}></ContainerList>
      <StyledLink onClick={edit} variant="inline" tabIndex={0}>Wijzigen</StyledLink>
    </Wrapper>
  );
};

export default Summary;
