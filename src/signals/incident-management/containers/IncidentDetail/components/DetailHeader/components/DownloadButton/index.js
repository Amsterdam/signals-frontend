/* eslint-disable jsx-a11y/href-no-hash,jsx-a11y/anchor-has-content */
import React from 'react';
import PropTypes from 'prop-types';
import 'whatwg-fetch';

class DownloadButton extends React.Component {
  constructor(props) {
    super(props);

    this.button = React.createRef();
    this.handleDownload = this.handleDownload.bind(this);
  }

  handleDownload(e, url, filename, accessToken) {
    e.preventDefault();
    e.stopPropagation();

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
          /* istanbul ignore next */
          if (navigator.msSaveOrOpenBlob) {
            navigator.msSaveOrOpenBlob(blob, filename);
          } else {
            const href = URL.createObjectURL(blob);
            const link = this.button.current;
            link.href = href;
            link.click();

            window.URL.revokeObjectURL(href);
          }
        });
  }

  render() {
    const { label, url, filename, accessToken } = this.props;
    return (
      <div className="download-button align-self-center">
        <a
          href="#"
          download={filename}
          className="incident-detail__button"
          data-testid="download-button"
          onClick={(e) => this.handleDownload(e, url, filename, accessToken)}
        >{label}</a>
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
