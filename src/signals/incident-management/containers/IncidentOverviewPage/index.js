import React, { useEffect, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';
import {
  Row,
  Column,
  Button,
  themeSpacing,
  Paragraph,
  themeColor,
} from '@datapunt/asc-ui';
import { disablePageScroll, enablePageScroll } from 'scroll-lock';
import styled from 'styled-components';

import MyFilters from 'signals/incident-management/containers/MyFilters';
import PageHeader from 'containers/PageHeader';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import {
  makeSelectDataLists,
  makeSelectActiveFilter,
  makeSelectPage,
  makeSelectOrdering,
} from 'signals/incident-management/selectors';
import {
  pageIncidentsChanged,
  orderingIncidentsChanged,
} from 'signals/incident-management/actions';
import LoadingIndicator from 'shared/components/LoadingIndicator';
import Filter from 'signals/incident-management/containers/Filter';
import Modal from 'components/Modal';
import Pagination from 'components/Pagination';
import * as types from 'shared/types';
import { FILTER_PAGE_SIZE } from 'signals/incident-management/constants';

import { makeSelectOverviewPage, makeSelectIncidentsCount } from './selectors';
import reducer from './reducer';
import saga from './saga';
import ListComponent from './components/List';
import FilterTagList from '../FilterTagList';

import './style.scss';

let lastActiveElement = null;

const StyledButton = styled(Button)`
  margin-left: 10px;
`;

const StyledPagination = styled(Pagination)`
  margin-top: ${themeSpacing(12)};
`;

const NoResults = styled(Paragraph)`
  width: 100%;
  text-align: center;
  font-family: Avenir Next LT W01 Demi, arial, sans-serif;
  color: ${themeColor('tint', 'level4')};
`;

export const IncidentOverviewPageContainerComponent = ({
  activeFilter,
  dataLists,
  incidentsCount,
  onChangeOrdering,
  onPageIncidentsChanged,
  ordering,
  overviewpage,
  page,
}) => {
  const [modalFilterIsOpen, toggleFilterModal] = useState(false);
  const [modalMyFiltersIsOpen, toggleMyFiltersModal] = useState(false);

  const openMyFiltersModal = useCallback(() => {
    disablePageScroll();
    toggleMyFiltersModal(true);
    lastActiveElement = document.activeElement;
  }, [toggleMyFiltersModal]);

  const closeMyFiltersModal = useCallback(() => {
    enablePageScroll();
    toggleMyFiltersModal(false);

    /* istanbul ignore next */
    if (lastActiveElement) {
      lastActiveElement.focus();
    }
  }, [toggleMyFiltersModal]);

  const openFilterModal = useCallback(() => {
    disablePageScroll();
    toggleFilterModal(true);
    lastActiveElement = document.activeElement;
  }, [toggleFilterModal]);

  const closeFilterModal = useCallback(() => {
    enablePageScroll();
    toggleFilterModal(false);

    /* istanbul ignore next */
    if (lastActiveElement) {
      lastActiveElement.focus();
    }
  }, [toggleFilterModal]);

  const escFunction = useCallback(
    event => {
      /* istanbul ignore next */
      if (event.keyCode === 27) {
        closeFilterModal();
        closeMyFiltersModal();
      }
    },
    [closeFilterModal, closeMyFiltersModal]
  );

  useEffect(() => {
    document.addEventListener('keydown', escFunction);
    document.addEventListener('openFilter', openFilterModal);

    return () => {
      document.removeEventListener('keydown', escFunction);
      document.removeEventListener('openFilter', openFilterModal);
    };
  }, [escFunction, openFilterModal]);

  const { incidents, loading } = useMemo(() => overviewpage, [overviewpage]);
  const totalPages = useMemo(
    () => Math.ceil(incidentsCount / FILTER_PAGE_SIZE),
    [incidentsCount, FILTER_PAGE_SIZE]
  );

  return (
    <div className="incident-overview-page">
      <PageHeader>
        <div>
          <StyledButton
            data-testid="myFiltersModalBtn"
            color="primary"
            onClick={openMyFiltersModal}
          >
            Mijn filters
          </StyledButton>

          <StyledButton
            data-testid="filterModalBtn"
            color="primary"
            onClick={openFilterModal}
          >
            Filteren
          </StyledButton>
        </div>

        <Modal
          data-testid="myFiltersModal"
          isOpen={modalMyFiltersIsOpen}
          onClose={closeMyFiltersModal}
          title="Mijn filters"
        >
          <MyFilters onClose={closeMyFiltersModal} />
        </Modal>

        <Modal
          data-testid="filterModal"
          isOpen={modalFilterIsOpen}
          onClose={closeFilterModal}
          title="Filters"
        >
          <Filter onSubmit={closeFilterModal} onCancel={closeFilterModal} />
        </Modal>

        <FilterTagList tags={activeFilter.options} />
      </PageHeader>

      <Row>
        <Column span={12} wrap>
          <Column span={12}>
            {loading && <LoadingIndicator />}

            {!loading && totalPages > 0 && (
              <ListComponent
                incidents={incidents}
                onChangeOrdering={onChangeOrdering}
                sort={ordering}
                incidentsCount={incidentsCount}
                {...dataLists}
              />
            )}

            {!loading && totalPages === 0 && (
              <NoResults>Geen meldingen</NoResults>
            )}
          </Column>

          <Column span={12}>
            {!loading && incidentsCount > 0 && (
              <StyledPagination
                currentPage={page}
                hrefPrefix="/manage/incidents?page="
                onClick={onPageIncidentsChanged}
                totalPages={totalPages}
              />
            )}
          </Column>
        </Column>
      </Row>
    </div>
  );
};

IncidentOverviewPageContainerComponent.defaultProps = {
  activeFilter: {},
  page: 1,
};

IncidentOverviewPageContainerComponent.propTypes = {
  activeFilter: types.filterType,
  dataLists: types.dataListsType.isRequired,
  incidentsCount: PropTypes.number,
  onChangeOrdering: PropTypes.func.isRequired,
  onPageIncidentsChanged: PropTypes.func.isRequired,
  ordering: PropTypes.string,
  overviewpage: types.overviewPageType.isRequired,
  page: PropTypes.number,
};

const mapStateToProps = createStructuredSelector({
  activeFilter: makeSelectActiveFilter,
  dataLists: makeSelectDataLists,
  incidentsCount: makeSelectIncidentsCount,
  ordering: makeSelectOrdering,
  overviewpage: makeSelectOverviewPage,
  page: makeSelectPage,
});

export const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      onChangeOrdering: orderingIncidentsChanged,
      onPageIncidentsChanged: pageIncidentsChanged,
    },
    dispatch
  );

const withConnect = connect(mapStateToProps, mapDispatchToProps);
const withReducer = injectReducer({ key: 'incidentOverviewPage', reducer });
const withSaga = injectSaga({ key: 'incidentOverviewPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect
)(IncidentOverviewPageContainerComponent);
