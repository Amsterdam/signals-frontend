import React, { useEffect, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';
import { Row, Column, Button, themeSpacing, Paragraph, themeColor } from '@datapunt/asc-ui';
import { disablePageScroll, enablePageScroll } from 'scroll-lock';
import styled from 'styled-components';

import MyFilters from 'signals/incident-management/containers/MyFilters';
import PageHeader from 'containers/PageHeader';
import { orderingChanged, pageChanged } from 'signals/incident-management/actions';
import LoadingIndicator from 'shared/components/LoadingIndicator';
import Filter from 'signals/incident-management/containers/Filter';
import Modal from 'components/Modal';
import * as types from 'shared/types';
import Pagination from 'components/Pagination';
import { FILTER_PAGE_SIZE } from 'signals/incident-management/constants';

import {
  makeSelectActiveFilter,
  makeSelectDataLists,
  makeSelectIncidents,
  makeSelectOrdering,
  makeSelectPage,
} from 'signals/incident-management/selectors';
import { MAP_URL, INCIDENTS_URL } from '../../routes';

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
  incidents,
  ordering,
  orderingChangedAction,
  page,
  pageChangedAction,
}) => {
  const [modalFilterIsOpen, toggleFilterModal] = useState(false);
  const [modalMyFiltersIsOpen, toggleMyFiltersModal] = useState(false);
  const { count, loading, results } = incidents;
  const location = useLocation();
  const showsMap = location.pathname === MAP_URL;

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

  const totalPages = useMemo(() => Math.ceil(count / FILTER_PAGE_SIZE), [count]);

  const canRenderList = results && results.length > 0 && totalPages > 0;

  return (
    <div className="incident-overview-page" data-testid="incidentManagementOverviewPage">
      <PageHeader>
        <div>
          <Link to={showsMap ? INCIDENTS_URL : MAP_URL}>{showsMap ? 'Lijst' : 'Kaart'}</Link>

          <StyledButton data-testid="myFiltersModalBtn" color="primary" onClick={openMyFiltersModal}>
            Mijn filters
          </StyledButton>

          <StyledButton data-testid="filterModalBtn" color="primary" onClick={openFilterModal}>
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

        <Modal data-testid="filterModal" isOpen={modalFilterIsOpen} onClose={closeFilterModal} title="Filters">
          <Filter onSubmit={closeFilterModal} onCancel={closeFilterModal} />
        </Modal>

        <FilterTagList tags={activeFilter.options} />
      </PageHeader>

      <Row>
        {showsMap && <span data-testid="24HourMap">Kaart</span>}

        {!showsMap && (
          <Column span={12} wrap>
            <Column span={12}>
              {loading && <LoadingIndicator />}

              {canRenderList && (
                <ListComponent
                  incidents={incidents.results}
                  onChangeOrdering={orderingChangedAction}
                  sort={ordering}
                  incidentsCount={count}
                  {...dataLists}
                />
              )}

              {count === 0 && <NoResults>Geen meldingen</NoResults>}
            </Column>

            <Column span={12}>
              {canRenderList && (
                <StyledPagination
                  currentPage={page}
                  hrefPrefix="/manage/incidents?page="
                  onClick={pageToNavigateTo => {
                    global.window.scrollTo(0, 0);
                    pageChangedAction(pageToNavigateTo);
                  }}
                  totalPages={totalPages}
                />
              )}
            </Column>
          </Column>
        )}
      </Row>
    </div>
  );
};

IncidentOverviewPageContainerComponent.defaultProps = {
  activeFilter: {},
  incidents: {},
  page: 1,
};

IncidentOverviewPageContainerComponent.propTypes = {
  activeFilter: types.filterType,
  dataLists: types.dataListsType.isRequired,
  incidents: PropTypes.shape({
    count: PropTypes.number,
    loading: PropTypes.bool,
    results: PropTypes.arrayOf(PropTypes.shape({})),
  }),
  orderingChangedAction: PropTypes.func.isRequired,
  pageChangedAction: PropTypes.func.isRequired,
  ordering: PropTypes.string,
  page: PropTypes.number,
};

const mapStateToProps = createStructuredSelector({
  activeFilter: makeSelectActiveFilter,
  dataLists: makeSelectDataLists,
  incidents: makeSelectIncidents,
  ordering: makeSelectOrdering,
  page: makeSelectPage,
});

export const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      orderingChangedAction: orderingChanged,
      pageChangedAction: pageChanged,
    },
    dispatch
  );

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(IncidentOverviewPageContainerComponent);
