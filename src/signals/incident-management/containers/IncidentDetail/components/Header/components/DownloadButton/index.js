/* eslint-disable jsx-a11y/href-no-hash,jsx-a11y/anchor-has-content */
import React from 'react';
import PropTypes from 'prop-types';
import 'whatwg-fetch';

import './style.scss';

class DownloadButton extends React.Component {
  constructor(props) {
    super(props);

    this.handleDownload = this.handleDownload.bind(this);
  }

  handleDownload(url, filename, accessToken) {
    const headers = {};

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    fetch(url, {
      method: 'GET',
      headers,
      responseType: 'blob'
    }).then((response) => response.blob())
        .then((blob) => {
          if (navigator.msSaveOrOpenBlob) {
            navigator.msSaveOrOpenBlob(blob, filename);
          } else {
            const href = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = href;
            link.download = filename;
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            link.remove();
          }
        });
  }

  render() {
    const { label, url, filename, accessToken } = this.props;
    return (
      <div className="download-button align-self-center">
        <button
          className="incident-detail__button"
          onClick={() => this.handleDownload(url, filename, accessToken)}
        >{label}</button>
      </div>
    );
  }

}

DownloadButton.propTypes = {
  url: PropTypes.string.isRequired,
  filename: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  accessToken: PropTypes.string
};

export default DownloadButton;
