import React, { useEffect, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';
import { Row, Column } from '@amsterdam/asc-ui';
import { disablePageScroll, enablePageScroll } from 'scroll-lock';

import MyFilters from 'signals/incident-management/containers/MyFilters';
import PageHeader from 'containers/PageHeader';
import { orderingChanged, pageChanged } from 'signals/incident-management/actions';
import Filter from 'signals/incident-management/containers/Filter';
import Modal from 'components/Modal';
import LoadingIndicator from 'components/LoadingIndicator';
import * as types from 'shared/types';
import { FILTER_PAGE_SIZE } from 'signals/incident-management/constants';
import MapContext from 'containers/MapContext';
import dataLists from 'signals/incident-management/definitions';
import useEventEmitter from 'hooks/useEventEmitter';
import {
  makeSelectActiveFilter,
  makeSelectIncidents,
  makeSelectOrdering,
  makeSelectPage,
} from 'signals/incident-management/selectors';

import { MAP_URL } from '../../routes';

import List from './components/List';
import OverviewMap from './components/OverviewMap';
import SubNav from './components/SubNav';
import FilterTagList from '../FilterTagList';
import { MapWrapper, NoResults, StyledButton, StyledPagination } from './styled';

let lastActiveElement = null;

export const IncidentOverviewPageContainerComponent = ({
  activeFilter,
  incidents,
  ordering,
  orderingChangedAction,
  page,
  pageChangedAction,
}) => {
  const { listenFor, unlisten } = useEventEmitter();
  const [modalFilterIsOpen, toggleFilterModal] = useState(false);
  const [modalMyFiltersIsOpen, toggleMyFiltersModal] = useState(false);
  const { count, loadingIncidents, results } = incidents;
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
    listenFor('keydown', escFunction);
    listenFor('openFilter', openFilterModal);

    return () => {
      unlisten('keydown', escFunction);
      unlisten('openFilter', openFilterModal);
    };
  }, [escFunction, openFilterModal, listenFor, unlisten]);

  const totalPages = useMemo(() => Math.ceil(count / FILTER_PAGE_SIZE), [count]);

  const canRenderList = results && results.length > 0 && totalPages > 0;

  return (
    <div className="incident-overview-page" data-testid="incidentManagementOverviewPage">
      <PageHeader>
        <div>
          <StyledButton data-testid="myFiltersModalBtn" color="primary" onClick={openMyFiltersModal}>
            Mijn filters
          </StyledButton>

          <StyledButton data-testid="filterModalBtn" color="primary" onClick={openFilterModal}>
            Filteren
          </StyledButton>
        </div>

        {modalMyFiltersIsOpen && (
          <Modal data-testid="myFiltersModal" onClose={closeMyFiltersModal} isOpen title="Mijn filters">
            <MyFilters onClose={closeMyFiltersModal} />
          </Modal>
        )}

        {modalFilterIsOpen && (
          <Modal data-testid="filterModal" isOpen onClose={closeFilterModal} title="Filters">
            <Filter onSubmit={closeFilterModal} onCancel={closeFilterModal} />
          </Modal>
        )}

        <FilterTagList tags={activeFilter.options} />
      </PageHeader>

      <SubNav showsMap={showsMap} />

      {showsMap && (
        <Row>
          <MapWrapper>
            <MapContext>
              <OverviewMap data-testid="24HourMap" />
            </MapContext>
          </MapWrapper>
        </Row>
      )}

      {!showsMap && (
        <Row>
          <Column span={12}>
            {loadingIncidents && <LoadingIndicator size={100} />}

            {canRenderList && (
              <List
                incidents={incidents.results}
                onChangeOrdering={orderingChangedAction}
                sort={ordering}
                incidentsCount={count}
                loading={loadingIncidents}
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
        </Row>
      )}
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
  incidents: PropTypes.shape({
    count: PropTypes.number,
    loadingIncidents: PropTypes.bool,
    results: PropTypes.arrayOf(PropTypes.shape({})),
  }),
  orderingChangedAction: PropTypes.func.isRequired,
  pageChangedAction: PropTypes.func.isRequired,
  ordering: PropTypes.string,
  page: PropTypes.number,
};

const mapStateToProps = createStructuredSelector({
  activeFilter: makeSelectActiveFilter,
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
