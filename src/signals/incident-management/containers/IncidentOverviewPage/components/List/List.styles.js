import styled, { css } from 'styled-components';

export const List = styled.div`
  width: 100%;

  ${({ isLoading }) =>
    isLoading &&
    css`
      opacity: 0.3;
    `}
`;

export const Table = styled.table`
  border-collapse: separate;
  width: 100%;
  height: 100%;

  td {
    padding: 0;

    a {
      text-decoration: none;
      color: black;
      display: block;
      width: 100%;
      height: 100%;
      padding: 8px;
    }
  }

  tr:hover td,
  td {
    box-shadow: unset;
  }
`;

export const Th = styled.th`
  cursor: pointer;
  font-weight: normal;
  white-space: nowrap;

  &:hover {
    text-decoration: underline;
  }
`;

export const Td = styled.td`
  ${({ noWrap }) =>
    noWrap &&
    css`
      white-space: nowrap;
    `}
`;
