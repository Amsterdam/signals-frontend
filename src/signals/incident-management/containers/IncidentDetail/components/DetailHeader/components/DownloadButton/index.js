/* eslint-disable jsx-a11y/href-no-hash,jsx-a11y/anchor-has-content */
import React from 'react';
import PropTypes from 'prop-types';
import 'whatwg-fetch';
import { isAuthenticated, getAccessToken } from 'shared/services/auth/auth';

class DownloadButton extends React.Component {
  constructor(props) {
    super(props);

    this.handleDownload = this.handleDownload.bind(this);
  }

  handleDownload(url, filename) {
    const headers = {};

    if (isAuthenticated()) {
      headers.Authorization = `Bearer ${getAccessToken()}`;
    }

    fetch(url, {
      method: 'GET',
      headers,
      responseType: 'blob'
    }).then((response) => response.blob())
        .then((blob) => {
          /* istanbul ignore next */
          if (navigator.msSaveOrOpenBlob) {
            navigator.msSaveOrOpenBlob(blob, filename);
          } else {
            const href = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = href;
            link.download = filename;
            document.body.appendChild(link);
            link.click();

            window.URL.revokeObjectURL(href);
            document.body.removeChild(link);
          }
        });
  }

  render() {
    const { label, url, filename } = this.props;
    return (
      <div className="download-button align-self-center">
        <button
          className="incident-detail__button"
          type="button"
          data-testid="download-button"
          onClick={() => this.handleDownload(url, filename, getAccessToken())}
        >{label}</button>
      </div>
    );
  }

}

DownloadButton.propTypes = {
  url: PropTypes.string.isRequired,
  filename: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default DownloadButton;
