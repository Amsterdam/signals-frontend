import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useParams, useHistory, Link } from 'react-router-dom';
import { Row, Column, themeSpacing, Button } from '@datapunt/asc-ui';
import styled from 'styled-components';

import LoadingIndicator from 'shared/components/LoadingIndicator';
import ListComponent from 'components/List';
import Pagination from 'components/Pagination';

import PageHeader from 'signals/settings/components/PageHeader';
import useFetchUsers from './hooks/useFetchUsers';
import { USERS_PAGED_URL, USER_URL } from '../../../routes';

const StyledPagination = styled(Pagination)`
  margin-top: ${themeSpacing(12)};
`;

const HeaderButton = styled(Button)`
  &:hover {
    color: white;
  }
`;

const UsersOverview = ({ pageSize }) => {
  const location = useLocation();
  const history = useHistory();
  const { pageNum } = useParams();
  const [page, setPage] = useState(1);
  const { isLoading, users } = useFetchUsers({ page, pageSize });

  /**
   * Get page number value from URL query string
   *
   * @returns {number|undefined}
   */
  const getPageNumFromQueryString = () => pageNum && parseInt(pageNum, 10);

  // subscribe to 'location' changes
  useEffect(() => {
    const pageNumber = getPageNumFromQueryString();

    if (pageNumber && pageNumber !== page) {
      setPage(pageNumber);
    }
  }, [location]);

  const onItemClick = e => {
    const {
      currentTarget: {
        dataset: { itemId },
      },
    } = e;

    if (itemId) {
      history.push(`${USER_URL}/${itemId}`);
    }
  };

  const onPaginationClick = pageToNavigateTo => {
    global.window.scrollTo(0, 0);
    history.push(`${USERS_PAGED_URL}/${pageToNavigateTo}`);
  };

  return (
    <Fragment>
      <PageHeader title={`Gebruikers ${users.count ? `(${users.count})` : ''}`}>
        <HeaderButton variant="primary" $as={Link} to={USER_URL}>
          Gebruiker toevoegen
        </HeaderButton>
      </PageHeader>

      <Row>
        {isLoading && <LoadingIndicator />}

        <Column span={12} wrap>
          <Column span={12}>
            {!isLoading && users.list && (
              <ListComponent
                columnOrder={['Gebruikersnaam', 'Rol', 'Status']}
                invisibleColumns={['id']}
                items={users.list}
                onItemClick={onItemClick}
                primaryKeyColumn="id"
              />
            )}
          </Column>

          {!isLoading && users.count && (
            <Column span={12}>
              <StyledPagination
                currentPage={page}
                onClick={onPaginationClick}
                totalPages={Math.ceil(users.count / pageSize)}
              />
            </Column>
          )}
        </Column>
      </Row>
    </Fragment>
  );
};

UsersOverview.defaultProps = {
  pageSize: 30,
};

UsersOverview.propTypes = {
  pageSize: PropTypes.number,
};

export default UsersOverview;
