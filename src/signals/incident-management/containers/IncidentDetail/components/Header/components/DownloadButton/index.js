import React from 'react';
import PropTypes from 'prop-types';
import 'whatwg-fetch';

import './style.scss';

function handleDownload(url, filename, accessToken) {
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
      const urlTag = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = urlTag;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
    });
}

const DownloadButton = ({ url, filename, accessToken }) => (
  <div className="download-button align-self-center">
    <button
      className="incident-detail__button--download"
      onClick={() => handleDownload(url, filename, accessToken)}
    />

  </div>
);

DownloadButton.propTypes = {
  url: PropTypes.string.isRequired,
  filename: PropTypes.string.isRequired,
  accessToken: PropTypes.string
};

export default DownloadButton;
