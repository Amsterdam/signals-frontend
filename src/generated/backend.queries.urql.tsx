import * as Types from './types';

import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type PageInfoFragment = (
  { __typename?: 'PageInfo' }
  & Pick<Types.PageInfo, 'endCursor' | 'hasNextPage' | 'hasPreviousPage' | 'startCursor'>
);

export type DepartmentQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type DepartmentQuery = (
  { __typename?: 'Query' }
  & { department?: Types.Maybe<(
    { __typename?: 'DepartmentType' }
    & Pick<Types.DepartmentType, 'id' | 'code' | 'name' | 'isIntern'>
  )> }
);

export type DepartmentsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type DepartmentsQuery = (
  { __typename?: 'Query' }
  & { departments?: Types.Maybe<(
    { __typename?: 'DepartmentTypeConnection' }
    & { pageInfo: (
      { __typename?: 'PageInfo' }
      & PageInfoFragment
    ), edges: Array<Types.Maybe<(
      { __typename?: 'DepartmentTypeEdge' }
      & { node?: Types.Maybe<(
        { __typename?: 'DepartmentType' }
        & Pick<Types.DepartmentType, 'id' | 'code' | 'name'>
      )> }
    )>> }
  )> }
);

export type CategoriesQueryVariables = Types.Exact<{
  first?: Types.Maybe<Types.Scalars['Int']>;
  orderBy?: Types.Maybe<Types.Scalars['String']>;
}>;


export type CategoriesQuery = (
  { __typename?: 'Query' }
  & { categories?: Types.Maybe<(
    { __typename?: 'CategoryTypeConnection' }
    & { edges: Array<Types.Maybe<(
      { __typename?: 'CategoryTypeEdge' }
      & { node?: Types.Maybe<(
        { __typename?: 'CategoryType' }
        & Pick<Types.CategoryType, 'id' | 'name' | 'slug'>
      )> }
    )>> }
  )> }
);

export type CategoryQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type CategoryQuery = (
  { __typename?: 'Query' }
  & { category?: Types.Maybe<(
    { __typename?: 'CategoryType' }
    & Pick<Types.CategoryType, 'id' | 'name' | 'slug' | 'handlingMessage' | 'isActive' | 'description'>
    & { parent?: Types.Maybe<(
      { __typename?: 'CategoryType' }
      & Pick<Types.CategoryType, 'id'>
    )> }
  )> }
);

export type CategoryWithDepartmentQueryVariables = Types.Exact<{
  id: Types.Scalars['ID'];
}>;


export type CategoryWithDepartmentQuery = (
  { __typename?: 'Query' }
  & { category?: Types.Maybe<(
    { __typename?: 'CategoryType' }
    & Pick<Types.CategoryType, 'id' | 'slug' | 'name' | 'handlingMessage' | 'isActive' | 'description'>
    & { parent?: Types.Maybe<(
      { __typename?: 'CategoryType' }
      & Pick<Types.CategoryType, 'id'>
    )>, departments?: Types.Maybe<(
      { __typename?: 'DepartmentTypeConnection' }
      & { edges: Array<Types.Maybe<(
        { __typename?: 'DepartmentTypeEdge' }
        & { node?: Types.Maybe<(
          { __typename?: 'DepartmentType' }
          & Pick<Types.DepartmentType, 'id' | 'name'>
        )> }
      )>> }
    )>, slo: (
      { __typename?: 'ServiceLevelObjectiveTypeConnection' }
      & { edges: Array<Types.Maybe<(
        { __typename?: 'ServiceLevelObjectiveTypeEdge' }
        & { node?: Types.Maybe<(
          { __typename?: 'ServiceLevelObjectiveType' }
          & Pick<Types.ServiceLevelObjectiveType, 'id' | 'nDays' | 'useCalendarDays'>
        )> }
      )>> }
    ), statusMessageTemplates: (
      { __typename?: 'StatusMessageTemplateTypeConnection' }
      & { edges: Array<Types.Maybe<(
        { __typename?: 'StatusMessageTemplateTypeEdge' }
        & { node?: Types.Maybe<(
          { __typename?: 'StatusMessageTemplateType' }
          & Pick<Types.StatusMessageTemplateType, 'id' | 'state' | 'title' | 'text'>
        )> }
      )>> }
    ) }
  )> }
);

export type Categories2QueryVariables = Types.Exact<{
  first: Types.Scalars['Int'];
}>;


export type Categories2Query = (
  { __typename?: 'Query' }
  & { categories?: Types.Maybe<(
    { __typename?: 'CategoryTypeConnection' }
    & { edges: Array<Types.Maybe<(
      { __typename?: 'CategoryTypeEdge' }
      & { node?: Types.Maybe<(
        { __typename?: 'CategoryType' }
        & Pick<Types.CategoryType, 'id' | 'name'>
      )> }
    )>> }
  )> }
);

export type CategoriesWithDepartmentsQueryVariables = Types.Exact<{
  first: Types.Scalars['Int'];
  after?: Types.Maybe<Types.Scalars['String']>;
  orderBy?: Types.Maybe<Types.Scalars['String']>;
}>;


export type CategoriesWithDepartmentsQuery = (
  { __typename?: 'Query' }
  & { categories?: Types.Maybe<(
    { __typename?: 'CategoryTypeConnection' }
    & { pageInfo: (
      { __typename?: 'PageInfo' }
      & PageInfoFragment
    ), edges: Array<Types.Maybe<(
      { __typename?: 'CategoryTypeEdge' }
      & Pick<Types.CategoryTypeEdge, 'cursor'>
      & { node?: Types.Maybe<(
        { __typename?: 'CategoryType' }
        & Pick<Types.CategoryType, 'id' | 'name' | 'slug'>
        & { departments?: Types.Maybe<(
          { __typename?: 'DepartmentTypeConnection' }
          & { edges: Array<Types.Maybe<(
            { __typename?: 'DepartmentTypeEdge' }
            & { node?: Types.Maybe<(
              { __typename?: 'DepartmentType' }
              & Pick<Types.DepartmentType, 'id' | 'name'>
            )> }
          )>> }
        )>, slo: (
          { __typename?: 'ServiceLevelObjectiveTypeConnection' }
          & { edges: Array<Types.Maybe<(
            { __typename?: 'ServiceLevelObjectiveTypeEdge' }
            & Pick<Types.ServiceLevelObjectiveTypeEdge, 'cursor'>
            & { node?: Types.Maybe<(
              { __typename?: 'ServiceLevelObjectiveType' }
              & Pick<Types.ServiceLevelObjectiveType, 'id' | 'nDays' | 'useCalendarDays'>
            )> }
          )>> }
        ), statusMessageTemplates: (
          { __typename?: 'StatusMessageTemplateTypeConnection' }
          & { edges: Array<Types.Maybe<(
            { __typename?: 'StatusMessageTemplateTypeEdge' }
            & Pick<Types.StatusMessageTemplateTypeEdge, 'cursor'>
            & { node?: Types.Maybe<(
              { __typename?: 'StatusMessageTemplateType' }
              & Pick<Types.StatusMessageTemplateType, 'id' | 'state' | 'title' | 'text'>
            )> }
          )>> }
        ) }
      )> }
    )>> }
  )> }
);

export const PageInfoFragmentDoc = gql`
    fragment PageInfo on PageInfo {
  endCursor
  hasNextPage
  hasPreviousPage
  startCursor
}
    `;
export const DepartmentDocument = gql`
    query department($id: ID!) {
  department(id: $id) {
    id
    code
    name
    isIntern
  }
}
    `;

export function useDepartmentQuery(options: Omit<Urql.UseQueryArgs<DepartmentQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<DepartmentQuery>({ query: DepartmentDocument, ...options });
};
export const DepartmentsDocument = gql`
    query departments {
  departments(first: 10) {
    pageInfo {
      ...PageInfo
    }
    edges {
      node {
        id
        code
        name
      }
    }
  }
}
    ${PageInfoFragmentDoc}`;

export function useDepartmentsQuery(options: Omit<Urql.UseQueryArgs<DepartmentsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<DepartmentsQuery>({ query: DepartmentsDocument, ...options });
};
export const CategoriesDocument = gql`
    query categories($first: Int, $orderBy: String) {
  categories(first: $first, orderBy: $orderBy) {
    edges {
      node {
        id
        name
        slug
      }
    }
  }
}
    `;

export function useCategoriesQuery(options: Omit<Urql.UseQueryArgs<CategoriesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<CategoriesQuery>({ query: CategoriesDocument, ...options });
};
export const CategoryDocument = gql`
    query category($id: ID!) {
  category(id: $id) {
    id
    name
    parent {
      id
    }
    slug
    handlingMessage
    isActive
    description
  }
}
    `;

export function useCategoryQuery(options: Omit<Urql.UseQueryArgs<CategoryQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<CategoryQuery>({ query: CategoryDocument, ...options });
};
export const CategoryWithDepartmentDocument = gql`
    query categoryWithDepartment($id: ID!) {
  category(id: $id) {
    id
    parent {
      id
    }
    slug
    name
    handlingMessage
    isActive
    description
    departments(first: 10) {
      edges {
        node {
          id
          name
        }
      }
    }
    departments(first: 10) {
      edges {
        node {
          id
          name
        }
      }
    }
    slo(first: 10) {
      edges {
        node {
          id
          nDays
          useCalendarDays
        }
      }
    }
    statusMessageTemplates(first: 10) {
      edges {
        node {
          id
          state
          title
          text
        }
      }
    }
  }
}
    `;

export function useCategoryWithDepartmentQuery(options: Omit<Urql.UseQueryArgs<CategoryWithDepartmentQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<CategoryWithDepartmentQuery>({ query: CategoryWithDepartmentDocument, ...options });
};
export const Categories2Document = gql`
    query categories2($first: Int!) {
  categories(first: $first) {
    edges {
      node {
        id
        name
      }
    }
  }
}
    `;

export function useCategories2Query(options: Omit<Urql.UseQueryArgs<Categories2QueryVariables>, 'query'> = {}) {
  return Urql.useQuery<Categories2Query>({ query: Categories2Document, ...options });
};
export const CategoriesWithDepartmentsDocument = gql`
    query categoriesWithDepartments($first: Int!, $after: String, $orderBy: String) {
  categories(first: $first, after: $after, orderBy: $orderBy) {
    pageInfo {
      ...PageInfo
    }
    edges {
      cursor
      node {
        id
        name
        slug
        departments(first: 10) {
          edges {
            node {
              id
              name
            }
          }
        }
        slo(first: 10) {
          edges {
            cursor
            node {
              id
              nDays
              useCalendarDays
            }
          }
        }
        statusMessageTemplates(first: 10) {
          edges {
            cursor
            node {
              id
              state
              title
              text
            }
          }
        }
      }
    }
  }
}
    ${PageInfoFragmentDoc}`;

export function useCategoriesWithDepartmentsQuery(options: Omit<Urql.UseQueryArgs<CategoriesWithDepartmentsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<CategoriesWithDepartmentsQuery>({ query: CategoriesWithDepartmentsDocument, ...options });
};