import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Heading, Row, Button } from '@datapunt/asc-ui';
import { disablePageScroll, enablePageScroll } from 'scroll-lock';
import Filter from 'signals/incident-management/containers/Filter';

import FilterTagList from 'signals/incident-management/containers/FilterTagList';

import Modal from 'components/Modal';

const StyledSection = styled.section`
  background-color: #f3f3f3;
  padding-top: 10px;
  padding-bottom: 10px;
  margin-bottom: 40px;
`;

let lastActiveElement = null;

const PageHeader = ({ className, children, title, filter }) => {
  const [modalIsOpen, toggleModal] = useState(false);

  const openModal = () => {
    disablePageScroll();
    toggleModal(true);
    lastActiveElement = document.activeElement;
  };

  function closeModal() {
    enablePageScroll();
    toggleModal(false);
    lastActiveElement.focus();
  }

  useEffect(() => {
    const escFunction = (event) => {
      if (event.keyCode === 27) {
        closeModal();
      }
    };
    const openFilterFuntion = () => {
      openModal();
    };

    document.addEventListener('keydown', escFunction);
    document.addEventListener('openFilter', openFilterFuntion);

    return () => {
      document.removeEventListener('keydown', escFunction);
      document.removeEventListener('openFilter', openFilterFuntion);
    };
  });

  return (
    <StyledSection className={className}>
      <Row>
        <Heading as="h1">{title}</Heading>

        {children}

        <Button
          data-testid="modalBtn"
          type="button"
          color="primary"
          as="button"
          onClick={openModal}
        >
          Filteren
        </Button>

        <Modal isOpen={modalIsOpen} onClose={closeModal} title="Filters">
          <Filter onSubmit={closeModal} onCancel={closeModal} />
        </Modal>
      </Row>

      <Row>
        <FilterTagList tags={filter.options} />
      </Row>
    </StyledSection>
  );
};

PageHeader.defaultProps = {
  className: '',
  children: null,
};

PageHeader.propTypes = {
  filter: PropTypes.shape({
    name: PropTypes.string,
    options: PropTypes.object,
  }).isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
};

export default PageHeader;
