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

  fetch(url, {
    method: 'GET',
    headers,
    responseType: 'blob'
  }).then((response) => response.blob())
    .then((blob) => {
      const link = document.querySelector('.download-button__link');
      link.href = window.URL.createObjectURL(blob);
      link.click();
    });
}

const DownloadButton = ({ url, filename, accessToken }) => (
  <div className="download-button align-self-center">
    <button
      className="incident-detail__button--download"
      onClick={() => handleDownload(url, filename, accessToken)}
    />

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
  accessToken: PropTypes.string
};

export default DownloadButton;
