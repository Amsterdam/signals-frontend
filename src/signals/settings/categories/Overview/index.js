import React, { Fragment, useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Row, Column, themeSpacing } from '@datapunt/asc-ui';
import { useParams, useHistory } from 'react-router-dom';

import PageHeader from 'signals/settings/components/PageHeader';
import LoadingIndicator from 'shared/components/LoadingIndicator';
import Pagination from 'components/Pagination';
import { makeSelectSubCategories } from 'models/categories/selectors';
import { makeSelectUserCan } from 'containers/App/selectors';
import { CATEGORIES_URL, CATEGORIES_PAGED_URL } from 'signals/settings/routes';
import DataView from 'components/DataView';
import filterData from '../../filterData';

// name mapping from API values to human readable values
export const colMap = {
  id: 'id',
  value: 'Categorie',
  is_active: 'Status',
  sla: 'Service Level Agreement',
};

const StyledDataView = styled(DataView)`
  th:first-child {
    width: 50%;
  }
`;

const StyledPagination = styled(Pagination)`
  margin-top: ${themeSpacing(12)};
`;

export const CategoriesOverviewContainer = ({ subCategories, userCan }) => {
  const isLoading = !subCategories;
  const history = useHistory();
  const params = useParams();
  const pageNum = params.pageNum && parseInt(params.pageNum, 10);
  const [page, setPage] = useState(1);
  const count = subCategories && subCategories.length;
  const pageSize = 50;
  const sliceStart = (pageNum - 1) * pageSize;

  const pagedData = (subCategories || [])
    .slice(sliceStart, sliceStart + pageSize)
    .map(category => ({
      ...category,
      sla: `${category.sla.n_days} ${
        !category.sla.use_calendar_days ? 'werk' : ''
      }dagen`,
    }));
  const data = filterData(pagedData, colMap);

  // subscribe to param changes
  useEffect(() => {
    if (pageNum && pageNum !== page) {
      setPage(pageNum);
    }
  }, [page, pageNum]);

  const onItemClick = useCallback(
    e => {
      if (!userCan('change_category')) {
        e.preventDefault();
        return;
      }

      const {
        currentTarget: {
          dataset: { itemId },
        },
      } = e;

      if (itemId) {
        history.push(`${CATEGORIES_URL}/${itemId}`);
      }
    },
    [history, userCan]
  );

  const onPaginationClick = useCallback(
    pageToNavigateTo => {
      global.window.scrollTo(0, 0);
      history.push(`${CATEGORIES_PAGED_URL}/${pageToNavigateTo}`);
    },
    [history]
  );

  const columnHeaders = ['Categorie', 'Service Level Agreement', 'Status'];

  return (
    <Fragment>
      <PageHeader title={`Categorieën ${count ? `(${count})` : ''}`} />

      <Row>
        {isLoading && <LoadingIndicator />}

        <Column span={12} wrap>
          <Column span={12}>
            <StyledDataView
              headers={columnHeaders}
              columnOrder={columnHeaders}
              invisibleColumns={[
                'id',
                '_display',
                'fk',
                'slug',
                'handling_message',
                'parentKey',
                '_links',
                'is_active',
                'description',
                'key',
              ]}
              onItemClick={onItemClick}
              primaryKeyColumn="fk"
              data={data}
            />
          </Column>

          {!isLoading && count > 0 && (
            <Column span={12}>
              <StyledPagination
                currentPage={page}
                onClick={onPaginationClick}
                totalPages={Math.ceil(count / pageSize)}
              />
            </Column>
          )}
        </Column>
      </Row>
    </Fragment>
  );
};

CategoriesOverviewContainer.propTypes = {
  subCategories: PropTypes.arrayOf(PropTypes.shape({})),
  userCan: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  subCategories: makeSelectSubCategories,
  userCan: makeSelectUserCan,
});

const withConnect = connect(mapStateToProps);

export default withConnect(CategoriesOverviewContainer);
