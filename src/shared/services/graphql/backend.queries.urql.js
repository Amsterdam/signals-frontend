import gql from 'graphql-tag';
import * as Urql from 'urql';
export const PageInfoFragmentDoc = gql `
    fragment PageInfo on PageInfo {
  endCursor
  hasNextPage
  hasPreviousPage
  startCursor
}
    `;
export const DepartmentDocument = gql `
    query department($id: ID!) {
  department(id: $id) {
    id
    code
    name
    isIntern
  }
}
    `;
export function useDepartmentQuery(options = {}) {
  return Urql.useQuery({ query: DepartmentDocument, ...options });
}
;
export const DepartmentsDocument = gql `
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
export function useDepartmentsQuery(options = {}) {
  return Urql.useQuery({ query: DepartmentsDocument, ...options });
}
;
export const CategoryDocument = gql `
    query category($id: ID!) {
  category(id: $id) {
    id
    name
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
          name
        }
      }
    }
    slo(first: 10) {
      edges {
        node {
          nDays
          useCalendarDays
        }
      }
    }
    statusMessageTemplates(first: 10) {
      edges {
        node {
          state
          title
          text
        }
      }
    }
  }
}
    `;
export function useCategoryQuery(options = {}) {
  return Urql.useQuery({ query: CategoryDocument, ...options });
}
;
export const CategoryFullDocument = gql `
    query categoryFull($id: ID!) {
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
          name
        }
      }
    }
    departments(first: 10) {
      edges {
        node {
          name
        }
      }
    }
    slo(first: 10) {
      edges {
        node {
          nDays
          useCalendarDays
        }
      }
    }
    statusMessageTemplates(first: 10) {
      edges {
        node {
          state
          title
          text
        }
      }
    }
  }
}
    `;
export function useCategoryFullQuery(options = {}) {
  return Urql.useQuery({ query: CategoryFullDocument, ...options });
}
;
export const CategoriesDocument = gql `
    query categories($first: Int!, $after: String, $orderBy: String) {
  categories(first: $first, after: $after, orderBy: $orderBy) {
    pageInfo {
      ...PageInfo
    }
    edges {
      node {
        id
        name
      }
    }
  }
}
    ${PageInfoFragmentDoc}`;
export function useCategoriesQuery(options = {}) {
  return Urql.useQuery({ query: CategoriesDocument, ...options });
}
;
export const CategoriesWithDepartmentsDocument = gql `
    query categoriesWithDepartments($first: Int!, $after: String, $orderBy: String) {
  categories(first: $first, after: $after, orderBy: $orderBy) {
    pageInfo {
      ...PageInfo
    }
    edges {
      node {
        id
        name
        departments(first: 10) {
          edges {
            node {
              name
            }
          }
        }
      }
    }
  }
}
    ${PageInfoFragmentDoc}`;
export function useCategoriesWithDepartmentsQuery(options = {}) {
  return Urql.useQuery({ query: CategoriesWithDepartmentsDocument, ...options });
}
;
