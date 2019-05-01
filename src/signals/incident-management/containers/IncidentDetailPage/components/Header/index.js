import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import './style.scss';

const Header = ({ incident, baseUrl, onThor }) => {
  const status = incident && incident.status && incident.status.state;
  const canSplit = (status === 'm') && !(incident && incident.parent_id);
  const canThor = ['m', 'i', 'b', 'h', 'send failed', 'reopened'].some((value) => value === status);
  const downloadLink = incident._links && incident._links['sia:pdf'];

  return (
    <header className="header">
      <div className="row">
        <div className="col-6 header__title align-self-center">Melding {incident.id}</div>
        <div className="col-6 header__buttons">
          {canSplit ? <Link to={`${baseUrl}/incident/${incident.id}/split`} className="align-self-center action-quad">Splitsen</Link> : ''}
          {canThor ? <button className="align-self-center action-quad" onClick={onThor}>THOR</button> : ''}
          <a href={downloadLink} className="align-self-center action-quad">Download PDF</a>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  incident: PropTypes.object.isRequired,
  baseUrl: PropTypes.string.isRequired,

  onThor: PropTypes.func.isRequired
};

export default Header;
