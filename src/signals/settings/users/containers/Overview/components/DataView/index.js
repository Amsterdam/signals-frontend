import React from 'react';
import PropTypes from 'prop-types';

import DataHeader from './DataHeader';
import DataFilter from './DataFilter';
import DataList from './DataList';

import { StyledTable, StyledTHead } from './styled';

export {
  DataHeader,
  DataFilter,
  DataList,
};

const allowedNodes = [
  DataHeader,
  DataFilter,
  DataList,
];

const filterOnlyAllowedNodes = children => React.Children.map(children, child => (
  child && allowedNodes.includes(child.type) ? child : null
));

const getUniqueNodes = children => {
  const uniqueNodes = children.reduce((acc, child) => {
    // Only interested in the first occurrence.
    if (acc[child.type.name]) return acc;

    return {
      ...acc,
      [child.type.name]: child,
      nodes: acc.nodes ? [
        ...acc.nodes,
        child,
      ] : [ child ],
    };
  },{});

  return uniqueNodes.nodes;
};

const splitHeaderRowsAndBody = children => {
  const headerRows = [];
  const body = [];

  children.forEach(child => child.type === DataList ? body.push(child) : headerRows.push(child));

  return [
    headerRows,
    body,
  ];
};

const DataView  = ({ children }) => {
  if (!children) return null;

  const filteredNodes = filterOnlyAllowedNodes(children);

  if (!filteredNodes.length) return null;

  const uniqueNodes = getUniqueNodes(filteredNodes);
  const [headerRows, body] = splitHeaderRowsAndBody(uniqueNodes);

  const renderHeaderRows = () => (
    <StyledTHead>
      {headerRows}
    </StyledTHead>
  );

  const renderBody = () => (
    <tbody>
      {body}
    </tbody>
  );

  return (
    <StyledTable data-testid="dataView">
      {headerRows.length > 0 && renderHeaderRows()}
      {body.length > 0 && renderBody()}
    </StyledTable>
  );
};

DataView.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DataView;
