import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import DownloadButton from './components/DownloadButton';

import './style.scss';

const DetailHeader = ({ incident, baseUrl, onThor, accessToken }) => {
  const status = incident && incident.status && incident.status.state;
  const canSplit = (status === 'm') && !(incident && incident.parent_id);
  const canThor = ['m', 'i', 'b', 'h', 'send failed', 'reopened'].some((value) => value === status);
  const downloadLink = incident._links && incident._links['sia:pdf'] && incident._links['sia:pdf'].href;

  return (
    <header className="detail-header">
      <div className="row">
        <div className="col-12">
          <Link to={`${baseUrl}/incidents`} className="startagain action" >Terug naar overzicht</Link>
        </div>

        <div className="col-6 detail-header__title align-self-center">Melding {incident.id}</div>
        <div className="col-6 detail-header__buttons d-flex justify-content-end">
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

          <DownloadButton
            label="PDF"
            url={downloadLink}
            filename={`SIA melding ${incident.id}.pdf`}
            accessToken={accessToken}
          />
        </div>
      </div>
    </header>
  );
};

DetailHeader.propTypes = {
  incident: PropTypes.object.isRequired,
  baseUrl: PropTypes.string.isRequired,
  accessToken: PropTypes.string.isRequired,

  onThor: PropTypes.func.isRequired
};

export default DetailHeader;
