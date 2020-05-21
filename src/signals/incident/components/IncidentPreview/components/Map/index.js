import React, { Fragment, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { themeSpacing } from '@datapunt/asc-ui';

import { formatAddress } from 'shared/services/map-location';
import MapStatic from 'components/MapStatic';

const Address = styled.address`
  margin-bottom: ${themeSpacing(4)};
  font-style: normal;
`;

/**
 * Map preview with one or more markers
 */
const MapPreview = ({ value }) => {
  const longitude = value?.geometrie?.coordinates[0];
  const latitude = value?.geometrie?.coordinates[1];

  const geometry = useMemo(
    () => ({
      latitude,
      longitude,
    }),
    [longitude, latitude]
  );

  return (
    value && (
      <Fragment>
        <Address>{value?.address ? formatAddress(value.address) : 'Geen adres gevonden'}</Address>
        {latitude && longitude && <MapStatic width={640} {...geometry} />}
      </Fragment>
    )
  );
};

MapPreview.propTypes = {
  value: PropTypes.shape({
    address: PropTypes.shape({
      openbare_ruimte: PropTypes.string,
      huisnummer: PropTypes.string,
      huisletter: PropTypes.string,
      huisnummer_toevoeging: PropTypes.string,
      postcode: PropTypes.string,
      woonplaats: PropTypes.string,
    }),
    geometrie: PropTypes.shape({
      coordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
    }),
  }),
};

export default MapPreview;
