import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, Link as AscLink } from '@amsterdam/asc-ui';
import { Close } from '@amsterdam/asc-assets';
import { Link } from 'react-router-dom';
import { INCIDENT_URL } from 'signals/incident-management/routes';

const Panel = styled.div`
  padding: 12px;
  background: white;
  outline: 2px solid rgba(0, 0, 0, 0.1);
  z-index: 401;
  display: flex;
  align-items: center;
  width: 350px;
  max-width: calc(100% - 40px);
  justify-content: space-between;
`;

const DetailPanel = ({ incidentId, onClose }) => (
  <Panel data-testid="mapDetailPanel">
    <AscLink as={Link} variant="inline" to={`${INCIDENT_URL}/${incidentId}`}>
      Melding {incidentId}
    </AscLink>
    <Button size={36} variant="blank" iconSize={14} icon={<Close />} onClick={onClose} />
  </Panel>
);

DetailPanel.propTypes = {
  incidentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DetailPanel;
