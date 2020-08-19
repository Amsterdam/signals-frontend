import React, { Fragment, useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Row, Column, themeSpacing } from '@datapunt/asc-ui';
import { useParams, useHistory } from 'react-router-dom';

import PageHeader from 'signals/settings/components/PageHeader';
import LoadingIndicator from 'components/LoadingIndicator';
import Pagination from 'components/Pagination';
import { makeSelectAllSubCategories } from 'models/categories/selectors';
import { makeSelectUserCan } from 'containers/App/selectors';
import { CATEGORY_URL, CATEGORIES_PAGED_URL } from 'signals/settings/routes';
import DataView from 'components/DataView';
import { PAGE_SIZE } from 'containers/App/constants';

import filterData from '../../filterData';

// name mapping from API values to human readable values
export const colMap = {
  fk: 'fk',
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
  const history = useHistory();
  const params = useParams();
  const [page, setPage] = useState(1);

  const pageNum = params.pageNum && Number.parseInt(params.pageNum, 10);
  const count = subCategories && subCategories.length;
  const sliceStart = (pageNum - 1) * PAGE_SIZE;
  const pagedData = (subCategories || [])
    .slice(sliceStart, sliceStart + PAGE_SIZE)
    .map(category => ({
      ...category,
      sla: `${category.sla.n_days} ${
        !category.sla.use_calendar_days ? 'werk' : ''
      }dagen`,
    }));
  const data = filterData(pagedData, colMap);
  const isLoading = !subCategories;

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
        history.push(`${CATEGORY_URL}/${itemId}`);
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
                totalPages={Math.ceil(count / PAGE_SIZE)}
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
  subCategories: makeSelectAllSubCategories,
  userCan: makeSelectUserCan,
});

const withConnect = connect(mapStateToProps);

export default withConnect(CategoriesOverviewContainer);
