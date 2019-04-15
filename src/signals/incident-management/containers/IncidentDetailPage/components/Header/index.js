import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import './style.scss';

const Header = ({ incident, baseUrl, onThor, onDownloadPdf }) => {
  // const status = incident && incident.status && incident.status.state;
  const canSplit = true; // (status === 'm') && !(incident && incident.parent_id);
  const canThor = true; // ['m', 'i', 'b', 'h', 'send failed', 'reopened'].some((value) => value === currentState);

  return (
    <header className="header">
      <div className="row">
        <div className="col-6 header__title align-self-center">Melding {incident.id}</div>
        <div className="col-6 header__buttons">
          {canSplit ? <Link to={`${baseUrl}/incident/${incident.id}/split`} className="align-self-center action-quad">Splitsen</Link> : ''}
          {canThor ? <button className="align-self-center action-quad" onClick={onThor}>THOR</button> : ''}
          <button className="align-self-center action-quad" onClick={onDownloadPdf}>Download PDF</button>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  incident: PropTypes.object.isRequired,
  baseUrl: PropTypes.string.isRequired,

  onThor: PropTypes.func.isRequired,
  onDownloadPdf: PropTypes.func.isRequired
};

export default Header;
