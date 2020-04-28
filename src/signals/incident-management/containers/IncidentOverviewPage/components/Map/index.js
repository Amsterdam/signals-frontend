import React, { memo, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import isEqual from 'lodash.isequal';
import moment from 'moment';
import L from 'leaflet';
import { ViewerContainer, themeColor, themeSpacing } from '@datapunt/asc-ui';

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
};

const OverviewMap = ({ ...rest }) => {
  const { dispatch } = useContext(MapContext);
  const [initialMount, setInitialMount] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [map, setMap] = useState();
  const { options } = useSelector(makeSelectActiveFilter);
  const filterParams = useSelector(makeSelectFilterParams);
  const { get, data, isLoading } = useFetch();
  const [layerInstance, setLayerInstance] = useState();
  const [incidentId, setIncidentId] = useState(0);

  const { ...params } = filterParams;

  // fixed query period (24 hours)
  params.created_after = useMemo(
    () =>
      moment()
        .subtract(1, 'days')
        .format('YYYY-MM-DDTHH:mm:ss'),
    []
  );
  params.created_before = useMemo(() => moment().format('YYYY-MM-DDTHH:mm:ss'), []);
  // fixed page size (default is 50; 4000 is 2.5 times the highest daily average)
  params.page_size = 4000;

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

  useEffect(() => {
    if (!options || isLoading || !initialMount) return;

    const { name, ...initialActive } = initialState.get('activeFilter').toJS();
    const paramsAreInitial = isEqual(initialActive.options, options);

    if (paramsAreInitial) return;

    get(`${configuration.GEOGRAPHY_ENDPOINT}`, params);

    // Only execute when the value of filterParams changes; disabling linter
    // eslint-disable-next-line
  }, [filterParams]);

  // request data on mount
  useEffect(() => {
    get(`${configuration.GEOGRAPHY_ENDPOINT}`, params);
    setInitialMount(true);

    // eslint-disable-next-line
  }, []);

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
          setIncidentId(feature.properties.id);
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
          maxZoom: 16,
          minZoom: 7,
          zoom: 7,
        }}
        setInstance={setMap}
      >
        <MarkerCluster clusterOptions={clusterLayerOptions} setInstance={setLayerInstance} />
        <StyledViewerContainer
          topLeft={
            <Autosuggest
              fieldList={['centroide_ll']}
              formatResponse={formatPDOKResponse}
              gemeentenaam="amsterdam"
              onSelect={onSelect}
              placeholder="Zoom naar adres"
            />
          }
          topRight={showPanel && <DetailPanel incidentId={incidentId} onClose={onClosePanel} />}
        />
      </StyledMap>
    </Wrapper>
  );
};

export default memo(OverviewMap);
