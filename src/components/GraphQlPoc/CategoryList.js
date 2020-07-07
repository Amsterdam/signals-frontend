import React, { useState } from 'react';

import { useQuery } from 'urql';

import Category from './Category';

import { QUERY_CATEGORIES_WITH_DEPARTMENTS } from '../../graphql/backend.queries';

const CategoryList = () => {
  const [after, setAfter] = useState(null);
  const [start, setStart] = useState(null);

  const variables = React.useMemo(() => ({
    first: 3,
    after,
    orderBy: 'slug',
  }), [after]);

  const [result] = useQuery({ query: QUERY_CATEGORIES_WITH_DEPARTMENTS, variables });

  const { data, fetching, error } = result;

  const categoriesToRender = React.useMemo(() => {
    if (!data || !data.categories) return [];
    setStart(data.categories.pageInfo.startCursor);
    return data.categories.edges.map(edge => edge.node);
  }, [data]);

  const nextPage = React.useCallback(() => {
    if (!data.categories.pageInfo.hasNextPage) return;

    setAfter(data.categories.pageInfo.endCursor);
  }, [data]);

  // const previousPage = React.useCallback(() => {
  //   console.log(data.categories.pageInfo);
  //   if (data.categories.pageInfo.hasPreviousPage) {
  //     setAfter(data.categories.pageInfo.startCursor);
  //   }
  // }, [data, start]);

  if (fetching) return <div>Fetching</div>;
  if (error) return <div>GraphQL error: {error.toString()}</div>;

  return (
    <React.Fragment>
      {categoriesToRender.map(category => (<Category key={category.id} category={category}/>))}

      <div>
        <h3>
          <button type="button" onClick={nextPage}>Next</button>
        </h3>
      </div>
    </React.Fragment>
  );
};

export default CategoryList;
