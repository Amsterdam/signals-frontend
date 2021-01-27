import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { FunctionComponent } from 'react';
import L from 'leaflet';
import MarkerCluster from 'components/MarkerCluster';
import type { GeoJSON as GeoJSONLayer, LatLng } from 'leaflet';
import type { Point, Feature as GeoJSONFeature, FeatureCollection } from 'geojson';
import WfsDataContext from '../../context';
import { featureTolocation } from 'shared/services/map-location';
import ContainerSelectContext from 'signals/incident/components/form/ContainerSelect/context';
import type { DataLayerProps, Item, Feature } from 'signals/incident/components/form/ContainerSelect/types';

export const ContainerLayer: FunctionComponent<DataLayerProps> = ({ featureTypes }) => {
  const [layerInstance, setLayerInstance] = useState<GeoJSONLayer>();
  const data = useContext<FeatureCollection>(WfsDataContext);
  const { selection, update } = useContext(ContainerSelectContext);

  const clusterOptions = useMemo<L.MarkerClusterGroupOptions>(
    () => ({
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      chunkedLoading: true,

      iconCreateFunction: /* istanbul ignore next */ cluster => {
        const childCount = cluster.getChildCount();

        return new L.DivIcon({
          html: `<div data-testid="markerClusterIcon"><span>${childCount}</span></div>`,
          className: 'marker-cluster',
          iconSize: new L.Point(40, 40),
        });
      },
    }),
    []
  );

  const getFeatureType = useCallback(
    (feature: Feature) => featureTypes.find(({ typeField, typeValue }) => feature.properties[typeField] === typeValue),
    [featureTypes]
  );

  const options = useMemo(
    () => ({
      pointToLayer: (feature: Feature, latlng: LatLng) => {
        const featureType = getFeatureType(feature);
        if (!featureType) return L.marker({ ...latlng, lat: 0, lng: 0 });
        const selected = Array.isArray(selection) && selection.some(
          // Exclude from coverage; with the curent leaflet mock this can't be tested
          /* istanbul ignore next*/({ id }) => id === feature.properties[featureType.idField]
        );

        const iconUrl = `data:image/svg+xml;base64,${btoa(
          /* istanbul ignore next */ // Exclude from coverage; with the curent leaflet mock this can't be tested
          selected ? featureType.icon.selectedIconSvg ?? '' : featureType.icon.iconSvg
        )}`;

        const marker = L.marker(latlng, {
          icon: L.icon({
            ...featureType.icon.options,
            className: featureType.label,
            iconUrl,
          }),
          alt: feature.properties[featureType.idField],
        });

        marker.on(
          'click',
          /* istanbul ignore next */ () => {
            const { description, typeValue, idField } = featureType;
            const item: Item = {
              id: feature.properties[idField] as string,
              type: typeValue,
              description,
            };

            const updateSelection = selected ? selection.filter(({ id }) => id !== item.id) : [...selection, item];

            update(updateSelection);
          }
        );

        return marker;
      },
    }),
    [getFeatureType, selection, update]
  );

  useEffect(() => {
    if (layerInstance) {
      layerInstance.clearLayers();
      data.features.forEach(feature => {
        const pointFeature: GeoJSONFeature<Point, any> = { ...feature, geometry: { ...(feature.geometry as Point) } };
        const { coordinates } = pointFeature.geometry;
        const latlng = featureTolocation({ coordinates });
        const marker = options.pointToLayer(pointFeature, latlng);
        /* istanbul ignore else */
        if (marker) {
          layerInstance.addLayer(marker);
        }
      });
    }

    return () => {
      if (layerInstance) {
        // This ensures that for each refresh of the data, the click
        // events that are bound in the layer data are removed.
        layerInstance.off('click');
      }
    };
  }, [layerInstance, data, options]);

  return <MarkerCluster clusterOptions={clusterOptions} setInstance={setLayerInstance} />;
};

export default ContainerLayer;
