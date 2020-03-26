import React from 'react';
import PropTypes from 'prop-types';

import { formatAddress } from 'shared/services/map-location';
import MAP_OPTIONS from 'shared/services/configuration/map-options';
import Map from 'components/Map';
import styled from '@datapunt/asc-core';
import { Row, Column, themeSpacing } from '@datapunt/asc-ui';

const StyledMap = styled(Map)`
  margin-top: ${themeSpacing(4)};
  height: 300px;
`;

const ItemWrapper = styled.div`
  padding: ${themeSpacing(5, 0)};
  width: 100%;
`;

/**
 * Map preview with one or more markers
 */
const MapPreview = ({ label, value }) => {
  const location = value?.geometrie?.coordinates;

  const lat = location && location[1];
  const lng = location && location[0];

  return (
    <Row hasMargin={false}>
      <Column span={{ small: 1, medium: 2, big: 6, large: 10, xLarge: 10 }} wrap>
        <Column span={{ small: 1, medium: 2, big: 2, large: 2, xLarge: 2 }}>
          <ItemWrapper>{label}</ItemWrapper>
        </Column>
        <Column span={{ small: 1, medium: 2, big: 4, large: 6, xLarge: 6 }}>
          {value && (
            <ItemWrapper>
              <div>
                {value.address ? formatAddress(value.address) : 'Geen adres gevonden'}
              </div>
              {lat && lng && <StyledMap lat={lat} lng={lng} mapOptions={MAP_OPTIONS} />}
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
  mapOptions: PropTypes.shape({}) /** leaflet options */,
};

export default MapPreview;
