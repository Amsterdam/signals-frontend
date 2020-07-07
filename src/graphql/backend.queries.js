import gql from 'graphql-tag';

const FRAGMENT_PAGE_INFO = gql`
  fragment PageInfo on PageInfo {
    endCursor
    hasNextPage
    hasPreviousPage
    startCursor
  }
`;

export const QUERY_DEPARTMENT = gql`
  query department($id: ID!) {
    department(id: $id) {
      id
      code
      name
      isIntern
    }
  }

  ${FRAGMENT_PAGE_INFO}
`;

export const QUERY_DEPARTMENTS = gql`
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

  ${FRAGMENT_PAGE_INFO}
`;

// export const QUERY_CATEGORIES = gql`
//   query categories($first: Int!, $after: String, $orderBy: String) {
//     categories(first: $first, after: $after, orderBy: $orderBy) {
//       pageInfo {
//         ...PageInfo
//       }
//       edges {
//         node {
//           id
//           name
//         }
//       }
//     }
//   }
//
//   ${FRAGMENT_PAGE_INFO}
// `;


export const QUERY_CATEGORIES = gql`
  # query categories($first: Int!, $after: String, $orderBy: String) {
  #   categories(first: $first, after: $after, orderBy: $orderBy) {
  #     pageInfo {
  #       ...PageInfo
  #     }
  #     edges {
  #       node {
  #         id
  #         name
  #       }
  #     }
  #   }
  # }

  query categories($first: Int, $orderBy: String) {
    categories(first: $first, orderBy: $orderBy) {
      edges {
        node {
          id
          name
          slug
        }
      }
      # links {
      #   id
      #   url
      #   description
      #   postedBy {
      #     id
      #     name
      #   }
      #   votes {
      #     id
      #     user {
      #       id
      #     }
      #   }
      #   createdAt
      # }
      # count
    }
  }

  # query CategoryQuery($first: Int, $skip: Int, $orderBy: CategoryOrderByInput) {
  #   categories(first: $first, skip: $skip, orderBy: $orderBy) {
  #     links {
  #       id
  #       url
  #       description
  #       postedBy {
  #         id
  #         name
  #       }
  #       votes {
  #         id
  #         user {
  #           id
  #         }
  #       }
  #       createdAt
  #     }
  #     count
  #   }
  # }

  ${FRAGMENT_PAGE_INFO}
`;

export const QUERY_CATEGORY = gql`
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

  ${FRAGMENT_PAGE_INFO}
`;


export const QUERY_CATEGORY_WITH_DEPARTMENT = gql`
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

  ${FRAGMENT_PAGE_INFO}
`;

export const QUERY_CATEGORIES2 = gql`
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

export const QUERY_CATEGORIES_WITH_DEPARTMENTS = gql`
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

  ${FRAGMENT_PAGE_INFO}
`;
