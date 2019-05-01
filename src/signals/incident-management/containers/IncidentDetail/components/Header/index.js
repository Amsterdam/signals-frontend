import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import './style.scss';

const Header = ({ incident, baseUrl, onThor }) => {
  const status = incident && incident.status && incident.status.state;
  const canSplit = (status === 'm') && !(incident && incident.parent_id);
  const canThor = ['m', 'i', 'b', 'h', 'send failed', 'reopened'].some((value) => value === status);
  const downloadLink = incident._links && incident._links['sia:pdf'] && incident._links['sia:pdf'].href;

  return (
    <header className="header">
      <div className="row">
        <div className="col-6 header__title align-self-center">Melding {incident.id}</div>
        <div className="col-6 header__buttons d-flex justify-content-end">
          {canSplit ?
            <Link
              to={`${baseUrl}/incident/${incident.id}/split`}
              className="incident-detail__button align-self-center"
            >Splitsen</Link> : ''}

          {canThor ?
            <button
              className="incident-detail__button align-self-center"
              onClick={onThor}
            >THOR</button> : ''}

          <a
            href={downloadLink}
            className="incident-detail__button--download align-self-center"
            title="Download melding"
          >&nbsp;</a>
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
