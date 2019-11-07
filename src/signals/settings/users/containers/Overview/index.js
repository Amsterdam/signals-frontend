import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useParams } from 'react-router-dom';
import { Row, Column } from '@datapunt/asc-ui';

import LoadingIndicator from 'shared/components/LoadingIndicator';
import ListComponent from 'components/List';
import Pager from 'components/Pager';

import PageHeader from 'signals/settings/components/PageHeader';
import useFetchUsers from './hooks/useFetchUsers';
import routes from '../../../routes';

const UsersOverview = ({ pageSize, history }) => {
  const location = useLocation();
  const { pageNum } = useParams();
  const [page, setPage] = useState(1);
  const { isLoading, users } = useFetchUsers({ page, pageSize });

  /**
   * Get page number value from URL query string
   *
   * @returns {number|undefined}
   */
  const getPageNumFromQueryString = () => pageNum && parseInt(pageNum, 10);

  // subscribe to 'page' state value changes
  useEffect(() => {
    if (history.action === 'POP') {
      return;
    }

    const pageNumber = getPageNumFromQueryString();

    if (pageNumber !== page) {
      history.push(routes.usersPaged.replace(':pageNum', page));
    }
  }, [page]);

  // subscribe to 'location' changes
  useEffect(() => {
    const pageNumber = getPageNumFromQueryString();

    if (pageNumber !== page) {
      setPage(pageNumber);
    }
  }, [location]);

  const onItemClick = e => {
    const { dataset } = e.currentTarget;
    const { itemId } = dataset;

    if (itemId) {
      history.push(routes.user.replace(':userId', itemId));
    }
  };

  return (
    <div className="users-overview-page">
      <PageHeader title={`Gebruikers (${users.length})`} />

      <Row>
        <Column span={12} wrap>
          <Column span={12}>
            {isLoading ? (
              <LoadingIndicator />
            ) : (
              <ListComponent
                columnOrder={['Gebruikersnaam', 'Rol', 'Status']}
                invisibleColumns={['id']}
                items={users}
                onItemClick={onItemClick}
                primaryKeyColumn="id"
              />
            )}
          </Column>

          <Column span={12}>
            {!isLoading && users.length && (
              <Pager
                itemCount={users.length}
                page={page}
                onPageChanged={pageNumber => {
                  history.push(routes.usersPaged.replace(':pageNum', pageNumber));
                }}
                pageSize={pageSize}
              />
            )}
          </Column>
        </Column>
      </Row>
    </div>
  );
};

UsersOverview.defaultProps = {
  pageSize: 30,
};

UsersOverview.propTypes = {
  history: PropTypes.shape({
    action: PropTypes.string,
    push: PropTypes.func,
    replace: PropTypes.func,
  }),
  pageSize: PropTypes.number,
};

export default UsersOverview;
