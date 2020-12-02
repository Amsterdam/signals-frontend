import React, { memo, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import isEqual from 'lodash.isequal';
import format from 'date-fns/format';
import subDays from 'date-fns/addDays';
import L from 'leaflet';
import { ViewerContainer, themeColor, themeSpacing } from '@amsterdam/asc-ui';

import MapContext from 'containers/MapContext/context';
import { setAddressAction } from 'containers/MapContext/actions';
import MAP_OPTIONS from 'shared/services/configuration/map-options';
import configuration from 'shared/services/configuration/configuration';
import { featureTolocation, formatPDOKResponse } from 'shared/services/map-location';
import { makeSelectFilterParams, makeSelectActiveFilter } from 'signals/incident-management/selectors';
import { initialState } from 'signals/incident-management/reducer';
import useFetch from 'hooks/useFetch';
import { incidentIcon, markerIcon } from 'shared/services/configuration/map-markers';
import Map from 'components/Map';
import PDOKAutoSuggest from 'components/PDOKAutoSuggest';
import MarkerCluster from './components/MarkerCluster';

import DetailPanel from './components/DetailPanel';

const POLLING_INTERVAL = 5000;

const StyledViewerContainer = styled(ViewerContainer)`
  flex-direction: row;

  & > * {
    left: ${themeSpacing(4)};
    right: ${themeSpacing(4)};
  }
`;

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

const StyledMap = styled(Map)`
  height: 600px;
  width: 100%;

  .marker-cluster {
    color: ${themeColor('tint', 'level1')};
    background-color: ${themeColor('tint', 'level1')};
    box-shadow: 1px 1px 1px #666666;

    div {
      width: 32px;
      height: 32px;
      margin-top: 4px;
      margin-left: 4px;
      background-color: #004699;
    }

    span {
      line-height: 34px;
    }
  }
`;

const Autosuggest = styled(PDOKAutoSuggest)`
  max-width: calc(100% - 40px);
  z-index: 401; // 400 is the minimum elevation were elements are shown above the map
  width: 350px;
  left: 0;
  position: absolute;
`;

const clusterLayerOptions = {
  showCoverageOnHover: false,
  zoomToBoundsOnClick: true,
  chunkedLoading: true,
  iconCreateFunction: cluster => {
    const childCount = cluster.getChildCount();
    let c = ' marker-cluster-';

    if (childCount < 10) {
      c += 'small';
    } else if (childCount < 100) {
      c += 'medium';
    } else {
      c += 'large';
    }

    return new L.DivIcon({
      html: `<div data-testid="markerClusterIcon"><span>${childCount}</span></div>`,
      className: `marker-cluster ${c}`,
      iconSize: new L.Point(40, 40),
    });
  },
};

const OverviewMap = ({ showPanelOnInit, ...rest }) => {
  const { dispatch } = useContext(MapContext);
  const [initialMount, setInitialMount] = useState(false);
  const [showPanel, setShowPanel] = useState(showPanelOnInit);
  const [map, setMap] = useState();
  const { options } = useSelector(makeSelectActiveFilter);
  const filterParams = useSelector(makeSelectFilterParams);
  const { get, data, isLoading } = useFetch();
  const [layerInstance, setLayerInstance] = useState();
  const [incident, setIncident] = useState(0);
  const [pollingCount, setPollingCount] = useState(0);

  const params = useMemo(
    () => ({
      ...filterParams,
      // fixed query period (24 hours, with featuere flag mapFilter24Hours enabled)
      created_after: configuration.featureFlags.mapFilter24Hours
        ? format(subDays(new Date(), -1), "yyyy-MM-dd'T'HH:mm:ss")
        : filterParams.created_after,
      created_before: configuration.featureFlags.mapFilter24Hours
        ? format(new Date(), "yyyy-MM-dd'T'HH:mm:ss")
        : filterParams.created_before,
      // fixed page size (default is 50; 4000 is 2.5 times the highest daily average)
      page_size: 4000,
    }),
    [filterParams]
  );

  /**
   * AutoSuggest callback handler
   *
   * Note that testing this functionality resembles integration testing, hence disabling istanbul coverage
   */
  const onSelect = useCallback(
    /* istanbul ignore next */ option => {
      dispatch(setAddressAction(option.value));

      if (map) {
        const currentZoom = map.getZoom();
        map.flyTo(option.data.location, currentZoom < 11 ? 11 : currentZoom);
      }
    },
    [map, dispatch]
  );

  const resetMarkerIcons = useCallback(() => {
    map.eachLayer(layer => {
      if (layer.getIcon && !layer.getAllChildMarkers) {
        layer.setIcon(incidentIcon);
      }
    });
  }, [map]);

  const onClosePanel = useCallback(() => {
    setShowPanel(false);
    resetMarkerIcons();
  }, [resetMarkerIcons]);

  const pollingFn = useCallback(() => {
    setPollingCount(pollingCount + 1);
  }, [pollingCount, setPollingCount]);

  useEffect(() => {
    const intervalId = setInterval(pollingFn, POLLING_INTERVAL);
    return () => {
      clearInterval(intervalId);
    };
  }, [pollingFn]);

  useEffect(() => {
    if (isLoading || !initialMount) return;

    get(`${configuration.GEOGRAPHY_ENDPOINT}`, params);

    // Only execute when the value of filterParams changes; disabling linter
    // eslint-disable-next-line
  }, [filterParams, pollingCount]);

  // request data on mount
  useEffect(() => {
    get(`${configuration.GEOGRAPHY_ENDPOINT}`, params);
    setInitialMount(true);
    // eslint-disable-next-line
  }, [get]);

  useEffect(() => {
    if (!data || !layerInstance) return () => {};

    data.features.forEach(feature => {
      const latlng = featureTolocation(feature.geometry);

      const clusteredMarker = L.marker(latlng, {
        icon: incidentIcon,
      });

      clusteredMarker.on('click', event => {
        resetMarkerIcons();

        event.target.setIcon(markerIcon);

        /* istanbul ignore else */
        if (feature.properties?.id) {
          setIncident(feature.properties);
          setShowPanel(true);
        }
      });

      layerInstance.addLayer(clusteredMarker);
    });

    return () => {
      layerInstance.clearLayers();
    };
  }, [layerInstance, data, map, resetMarkerIcons]);

  return (
    <Wrapper {...rest}>
      <StyledMap
        data-testid="overviewMap"
        hasZoomControls
        mapOptions={{
          ...MAP_OPTIONS,
          ...(configuration.map.optionsBackOffice || {}),
        }}
        setInstance={setMap}
      >
        <MarkerCluster clusterOptions={clusterLayerOptions} setInstance={setLayerInstance} />
        <StyledViewerContainer
          topLeft={
            <Autosuggest
              fieldList={['centroide_ll']}
              formatResponse={formatPDOKResponse}
              municipality={configuration.map?.municipality}
              onSelect={onSelect}
              placeholder="Zoom naar adres"
            />
          }
          topRight={showPanel && <DetailPanel incident={incident} onClose={onClosePanel} />}
        />
      </StyledMap>
    </Wrapper>
  );
};

OverviewMap.defaultProps = {
  showPanelOnInit: false,
};

OverviewMap.propTypes = {
  showPanelOnInit: PropTypes.bool,
};

export default memo(OverviewMap);
