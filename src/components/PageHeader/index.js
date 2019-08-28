import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Heading, Row, Button, Paragraph } from '@datapunt/asc-ui';
import { disablePageScroll, enablePageScroll } from 'scroll-lock';
import Filter from 'signals/incident-management/containers/Filter';

import Modal from 'components/Modal';

const StyledSection = styled.section`
  background-color: #f3f3f3;
  padding-top: 14px;
  padding-bottom: 10px;
  margin-bottom: 40px;
`;

const ModalButton = styled(Button)`
  font-family: inherit;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-weight: bold;
  max-height: 50px;
`;

let lastActiveElement = null;

const PageHeader = ({ className, children, subTitle, title }) => {
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

    document.addEventListener('keydown', escFunction);

    return () => {
      document.removeEventListener('keydown', escFunction);
    };
  });

  const StyledHeading = styled(Heading)`
    font-size: 20px;
  `;

  return (
    <StyledSection className={className}>
      <Row>
        <div>
          <StyledHeading>{title}</StyledHeading>
          {subTitle && <Paragraph>{subTitle}</Paragraph>}
        </div>

        {children}

        <ModalButton
          data-testid="modalBtn"
          type="button"
          color="primary"
          $as="button"
          onClick={openModal}
        >
          Filteren
        </ModalButton>

        <Modal isOpen={modalIsOpen} onClose={closeModal} title="Filters">
          <Filter onSubmit={closeModal} onCancel={closeModal} />
        </Modal>
      </Row>
    </StyledSection>
  );
};

PageHeader.defaultProps = {
  className: '',
  children: null,
  subTitle: '',
};

PageHeader.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  subTitle: PropTypes.string,
  title: PropTypes.string.isRequired,
};

export default PageHeader;
