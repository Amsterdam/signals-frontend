import React from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import { Row, Column, themeSpacing } from '@datapunt/asc-ui';
import { formatAddress } from 'shared/services/map-location';
import MapStatic  from 'components/MapStatic';

const ItemWrapper = styled.div`
  padding: ${themeSpacing(5, 0)};
  width: 100%;
`;

/**
 * Map preview with one or more markers
 */
const MapPreview = ({ label, value }) => {
  const longitude = value.geometrie.coordinates[0];
  const latitude = value.geometrie.coordinates[1];

  return (
    <Row hasMargin={false}>
      <Column span={{ small: 1, medium: 2, big: 6, large: 10, xLarge: 11 }} wrap>
        <Column span={{ small: 1, medium: 2, big: 2, large: 2, xLarge: 2 }}>
          <ItemWrapper>{label}</ItemWrapper>
        </Column>

        <Column span={{ small: 1, medium: 2, big: 4, large: 6, xLarge: 7 }}>
          {value && (
            <ItemWrapper>
              <div>{value.address ? formatAddress(value.address) : 'Geen adres gevonden'}</div>
              <MapStatic latitude={latitude} longitude={longitude} width={640} />
            </ItemWrapper>
          )}
        </Column>
      </Column>
    </Row>
  );
};

MapPreview.propTypes = {
  label: PropTypes.string,
  value: PropTypes.shape({
    address: PropTypes.object,
    geometrie: PropTypes.object,
  }),
};

export default MapPreview;
