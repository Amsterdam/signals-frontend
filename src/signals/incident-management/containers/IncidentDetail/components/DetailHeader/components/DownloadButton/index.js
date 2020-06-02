import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';
import { Spinner } from '@datapunt/asc-assets';
import Button  from 'components/Button';

import useFetch from 'hooks/useFetch';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const Spinning = styled(Spinner)`
  & > * {
    transform-origin: 50% 50%;
    animation: ${rotate} 2s linear infinite;
  }
`;

const DownloadButton = ({ label, url, filename }) => {
  const { get, isLoading, data } = useFetch();

  useEffect(() => {
    if (!data) return;

    if (navigator.msSaveOrOpenBlob) {
      navigator.msSaveOrOpenBlob(data, filename);
    } else {
      const href = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = href;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      window.URL.revokeObjectURL(href);
      document.body.removeChild(link);
    }
  }, [data, filename]);

  const handleDownload = useCallback(() => {
    get(url, {}, { responseType: 'blob' });
  }, [get, url]);

  return (
    <Button
      disabled={isLoading}
      iconRight={isLoading && <Spinning />}
      iconSize={20}
      variant="application"
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
