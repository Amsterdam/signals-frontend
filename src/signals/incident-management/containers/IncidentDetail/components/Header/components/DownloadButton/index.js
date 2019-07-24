/* eslint-disable jsx-a11y/href-no-hash,jsx-a11y/anchor-has-content */
import React from 'react';
import PropTypes from 'prop-types';
import 'whatwg-fetch';

import './style.scss';

class DownloadButton extends React.Component {
  constructor(props) {
    super(props);

    this.downloadLink = React.createRef();
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
            const link = this.downloadLink.current;
            link.href = window.URL.createObjectURL(blob);
            link.click();
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

        <a
          href="#"
          ref={this.downloadLink}
          className="download-button__link"
          download={filename}
        ></a>
      </div>
    );
  }

}
// const DownloadButton = ({ label, url, filename, accessToken }) => (
  // <div className="download-button align-self-center">
    // <button
      // className="incident-detail__button"
      // onClick={() => handleDownload(url, filename, accessToken)}
    // >{label}</button>
//
    // <a
      // href="#"
      // className="download-button__link"
      // download={filename}
    // ></a>
  // </div>
    // );

DownloadButton.propTypes = {
  url: PropTypes.string.isRequired,
  filename: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  accessToken: PropTypes.string
};

export default DownloadButton;
