import React, { memo, useContext, useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import isEqual from 'lodash.isequal';
import moment from 'moment';

import MapContext from 'containers/MapContext/context';
import { setAddressAction } from 'containers/MapContext/actions';
import Map from 'components/Map';
import PDOKAutoSuggest from 'components/PDOKAutoSuggest';
import MAP_OPTIONS from 'shared/services/configuration/map-options';
import configuration from 'shared/services/configuration/configuration';
import { centroideToLocation } from 'shared/services/map-location';
import { makeSelectFilterParams, makeSelectActiveFilter } from 'signals/incident-management/selectors';
import { initialState } from 'signals/incident-management/reducer';
import useFetch from 'hooks/useFetch';
// import { GeoJSON } from '@datapunt/react-maps';
import { markerIcon } from 'shared/services/configuration/map-markers';

import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

import L, { DomEvent } from 'leaflet';
import 'leaflet.markercluster';

import MarkerCluster from './components/MarkerCluster';

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

const StyledMap = styled(Map)`
  height: 450px;
  width: 100%;
`;

const Autosuggest = styled(PDOKAutoSuggest)`
  position: absolute;
  top: 30px;
  left: 20px;
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


const markerStyleActive = {
  weight: 5,
  dashArray: '',
};

// const getOptions = onIncidentSelected => ({
//   onEachFeature: (feature, layer) => {
//     layer.on('click', event => {
//       DomEvent.stopPropagation(event);
//       event.target.setStyle(markerStyleActive);
//       onIncidentSelected(feature, layer);

//       // console.log(feature, layer._icon);
//     });
//   },
//   pointToLayer: (feature, latlng) => L.circleMarker(latlng, markerStyle),
// });

const clusterLayerOptions = {
  showCoverageOnHover: false,
};

export const getPointOptions = onIncidentSelected => ({
  onEachFeature: (feature, layer) => {
    layer.on('click', event => {
      DomEvent.stopPropagation(event);
      event.target.setStyle(markerStyleActive);
      onIncidentSelected(feature, layer._icon);
      console.log(feature, layer._icon);
    });
  },
  pointToLayer: (feature, latlng) => {
    const marker = L.marker(latlng, {
      icon: markerIcon,
    });
    marker.feature = feature;
    return marker;
  },
});

const OverviewMap = ({ ...rest }) => {
  const { dispatch } = useContext(MapContext);
  const [initialMount, setInitialMount] = useState(false);
  const [map, setMap] = useState();
  const { options } = useSelector(makeSelectActiveFilter);
  const filterParams = useSelector(makeSelectFilterParams);
  const { get, data, isLoading } = useFetch();
  const [layerInstance, setLayerInstance] = useState();

  const { ...params } = filterParams;
  params.created_after = moment()
    .subtract(1, 'days')
    .format('YYYY-MM-DDTkk:mm:ss');

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

  const onIncidentSelected = useCallback((feature, element) => {
    // trigger show the detail panel
    console.log(feature, element);
  }, []);

  // GeoJSON
  // useEffect(() => {
  //   if (!data || !layerInstance) return;
  //   layerInstance.clearLayers();
  //   layerInstance.addData(data);
  // }, [data, layerInstance]);

  useEffect(() => {
    // if (!data || !layerInstance) return;
    // layerInstance.clearLayers();
    // const layer = L.geoJSON(data, getPointOptions(onIncidentSelected));
    // layerInstance.addLayer(layer);
  }, [layerInstance, data, onIncidentSelected]);

  return (
    <Wrapper {...rest}>
      <StyledMap data-testid="overviewMap" mapOptions={MAP_OPTIONS} setInstance={setMap}>
        {/* <GeoJSON setInstance={setLayerInstance} args={[data]} options={getOptions(onIncidentSelected)} /> */}
        <MarkerCluster clusterOptions={clusterLayerOptions} setInstance={setLayerInstance} />
      </StyledMap>

      <Autosuggest
        onSelect={onSelect}
        gemeentenaam="amsterdam"
        fieldList={['centroide_ll']}
        formatResponse={formatResponse}
      />
    </Wrapper>
  );
};

export default memo(OverviewMap);
