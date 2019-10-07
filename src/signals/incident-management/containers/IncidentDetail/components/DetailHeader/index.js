import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { incidentType } from 'shared/types';

import DownloadButton from './components/DownloadButton';

import './style.scss';

const DetailHeader = ({ incident, baseUrl, onPatchIncident }) => {
  const status = incident && incident.status && incident.status.state;
  const canSplit = (status === 'm') && !(incident && (incident._links['sia:children'] || incident._links['sia:parent']));
  const canThor = ['m', 'i', 'b', 'h', 'send failed', 'reopened'].some((value) => value === status);
  const downloadLink = incident._links && incident._links['sia:pdf'] && incident._links['sia:pdf'].href;
  const patch = {
    id: incident.id,
    type: 'thor',
    patch: {
      status: {
        state: 'ready to send',
        text: 'Te verzenden naar THOR',
        target_api: 'sigmax'
      }
    }
  };

  return (
    <header className="detail-header">
      <div className="row">
        <div className="col-12">
          <Link
            to={`${baseUrl}/incidents`}
            className="startagain action"
            data-testid="detail-header-button-back"
          >Terug naar overzicht</Link>
        </div>

        <div className="col-6 detail-header__title align-self-center" data-testid="detail-header-title">Melding {incident.id}</div>
        <div className="col-6 detail-header__buttons d-flex justify-content-end">
          {canSplit ?
            <Link
              to={`${baseUrl}/incident/${incident.id}/split`}
              className="incident-detail__button align-self-center"
              data-testid="detail-header-button-split"
            >Splitsen</Link> : ''}

          {canThor ?
            <button
              className="incident-detail__button align-self-center"
              type="button"
              onClick={() => onPatchIncident(patch)}
              data-testid="detail-header-button-thor"
            >THOR</button> : ''}

          <DownloadButton
            label="PDF"
            url={downloadLink}
            filename={`SIA melding ${incident.id}.pdf`}
            data-testid="detail-header-button-download"
          />
        </div>
      </div>
    </header>
  );
};

DetailHeader.propTypes = {
  incident: incidentType.isRequired,
  baseUrl: PropTypes.string.isRequired,
  onPatchIncident: PropTypes.func.isRequired
};

export default DetailHeader;
