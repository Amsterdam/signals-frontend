import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import LoadingIndicator from 'components/LoadingIndicator';

import useFetch from 'hooks/useFetch';

const DownloadButton = ({ label, url, filename }) => {
  const { get, isLoading, data } = useFetch();

  useEffect(() => {
    if (!data) return;

    if (navigator.msSaveOrOpenBlob) {
      navigator.msSaveOrOpenBlob(data, filename);
    } else {
      const href = global.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = href;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      global.URL.revokeObjectURL(href);
      document.body.removeChild(link);
    }
    // Disabling linter; `filename` dependency triggers a download when changing the incident
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleDownload = useCallback(() => {
    get(url, {}, { responseType: 'blob' });
  }, [get, url]);

  return (
    <Button
      type="button"
      variant="application"
      disabled={isLoading}
      iconRight={isLoading && <LoadingIndicator />}
      iconSize={20}
      data-testid="download-button"
      onClick={handleDownload}
    >
      {label}
    </Button>
  );
};

DownloadButton.propTypes = {
  url: PropTypes.string.isRequired,
  filename: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default DownloadButton;
