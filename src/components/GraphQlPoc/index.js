import React, { Fragment } from 'react';
import styled from 'styled-components';

import { Typography, themeColor } from '@datapunt/asc-ui';

import { ChevronLeft } from '@datapunt/asc-assets';

import { useCategoriesWithDepartmentsQuery } from 'shared/services/graphql/backend.queries.urql';

import CategoryList from './CategoryList';

const Label = styled(Typography).attrs({
  forwardedAs: 'span',
})`
  font-size: 16px;
  color: ${themeColor('primary')};
  font-family: Avenir Next LT W01 Demi, arial, sans-serif;
`;

const Chevron = styled(ChevronLeft)`
  display: inline-block;
`;

const GraphQlPoc = () => {
  // const [ result ] = useCategoriesQuery({ variables: { first: 50 } });
  // console.log(result);

  const [ result2 ] = useCategoriesWithDepartmentsQuery({ variables: { first: 50 } });
  console.log(result2);

  return (
    <Fragment>
      <Chevron />
      <Label>GraphQl POC</Label>
      <CategoryList />
    </Fragment>
  );
};
export default GraphQlPoc;
