/* eslint-disable jsx-a11y/href-no-hash,jsx-a11y/anchor-has-content */
import React from 'react';
import PropTypes from 'prop-types';
import 'whatwg-fetch';

import './style.scss';

function handleDownload(url, filename, accessToken) {
  const headers = {};

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  headers.Origin = window.location.origin;

  console.log('request', url, { method: 'GET',
    headers,
    responseType: 'blob'
  });

  fetch(url, {
    method: 'GET',
    headers,
    responseType: 'blob'
  }).then((response) => response.blob())
    .then((blob) => {
      console.log('BLOB', blob);
      const link = document.querySelector('.download-button__link');
      link.href = window.URL.createObjectURL(blob);
      link.click();
    });
}

const DownloadButton = ({ label, url, filename, accessToken }) => (
  <div className="download-button align-self-center">
    <button
      className="incident-detail__button"
      onClick={() => handleDownload(url, filename, accessToken)}
    >{label}</button>

    <a
      href="#"
      className="download-button__link"
      download={filename}
    ></a>
  </div>
);

DownloadButton.propTypes = {
  url: PropTypes.string.isRequired,
  filename: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  accessToken: PropTypes.string
};

export default DownloadButton;
