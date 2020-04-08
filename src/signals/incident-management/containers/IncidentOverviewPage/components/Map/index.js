import React, { memo, useContext, useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import isEqual from 'lodash.isequal';
import moment from 'moment';
import { ViewerContainer } from '@datapunt/asc-ui';

import MapContext from 'containers/MapContext/context';
import { setAddressAction } from 'containers/MapContext/actions';
import Map from 'components/Map';
import PDOKAutoSuggest from 'components/PDOKAutoSuggest';
import MAP_OPTIONS from 'shared/services/configuration/map-options';
import configuration from 'shared/services/configuration/configuration';
import { centroideToLocation, featureTolocation } from 'shared/services/map-location';
import { makeSelectFilterParams, makeSelectActiveFilter } from 'signals/incident-management/selectors';
import { initialState } from 'signals/incident-management/reducer';
import useFetch from 'hooks/useFetch';
import {  smallMarkerIcon } from 'shared/services/configuration/map-markers';
import L from 'leaflet';

import MarkerCluster from './components/MarkerCluster';

import DetailPanel from './components/DetailPanel';

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

const StyledMap = styled(Map)`
  height: 450px;
  width: 100%;
`;

const Autosuggest = styled(PDOKAutoSuggest)`
  max-width: calc(100% - 40px);
  z-index: 401; // 400 is the minimum elevation were elements are shown above the map
`;

const formatResponse = ({ response }) =>
  response.docs.map(result => {
    const { id, weergavenaam, centroide_ll } = result;
    return {
      id,
      value: weergavenaam,
      data: {
        location: centroideToLocation(centroide_ll),
      },
    };
  });

const clusterLayerOptions = {
  showCoverageOnHover: false,
  zoomToBoundsOnClick: true,
  disableClusteringAtZoom: 13,
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

  const { ...params } = filterParams;
  params.created_after = moment()
    .subtract(1, 'days')
    .format('YYYY-MM-DDTkk:mm:ss');
  params.created_before = moment().format('YYYY-MM-DDTkk:mm:ss');

  const onSelect = useCallback(
    option => {
      dispatch(setAddressAction(option.value));

      if (map) {
        const currentZoom = map.getZoom();
        map.flyTo(option.data.location, currentZoom < 11 ? 11 : currentZoom);
      }
    },
    [map, dispatch]
  );

  // this handlers should act on marker clicks when marker cluster layer has been implemented
  const onMapClick = useCallback(() => {
    setShowPanel(true);
  }, []);

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
    if (!data || !layerInstance) return () => { };
    layerInstance.clearLayers();
    data.features.forEach(item => {
      const latlng = featureTolocation(item.geometry);
      const marker = L.marker(latlng, {
        icon: smallMarkerIcon,
      });
      layerInstance.addLayer(marker);
    });

    return () => {
      layerInstance.clearLayers();
    };
  }, [layerInstance, data]);

  return (
    <Wrapper {...rest}>
      <StyledMap
        data-testid="overviewMap"
        mapOptions={{
          ...MAP_OPTIONS,
          maxZoom: 16,
          minZoom: 8,
        }}
        events={{ click: onMapClick }}
        setInstance={setMap}
      >
        <MarkerCluster clusterOptions={clusterLayerOptions} setInstance={setLayerInstance} />
        <ViewerContainer
          topLeft={
            <Autosuggest
              onSelect={onSelect}
              gemeentenaam="amsterdam"
              fieldList={['centroide_ll']}
              formatResponse={formatResponse}
            />
          }
          topRight={showPanel && <DetailPanel incidentId={123} onClose={() => setShowPanel(false)} />}
        />
      </StyledMap>
    </Wrapper>
  );
};

export default memo(OverviewMap);
