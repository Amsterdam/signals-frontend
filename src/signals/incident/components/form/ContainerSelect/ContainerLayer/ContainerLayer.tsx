import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { FunctionComponent } from 'react';
import L from 'leaflet';
import MarkerCluster from 'components/MarkerCluster';
import type { GeoJSON as GeoJSONLayer, LatLng } from 'leaflet';
import type { Point, Feature as GeoJSONFeature, FeatureCollection } from 'geojson';
import WfsDataContext from '../WfsLayer/WfsDataContext';
import { featureTolocation } from 'shared/services/map-location';
import type { DataLayerProps, FeatureType, Item, Feature } from '../types';
import ContainerSelectContext from '../ContainerSelectContext';

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

  type GeoJSONOptions = {
    pointToLayer: (feature: Feature, latlng: LatLng) => L.Layer;
  };
  const options = useMemo<GeoJSONOptions>(
    () => ({
      pointToLayer: (feature, latlng: LatLng) => {
        const featureType = getFeatureType(feature);
        if (!featureType) return L.marker({ ...latlng, lat: 0, lng: 0 });
        const selected = selection.some(({ id }) => id === feature.properties[featureType.idField]);

        const iconUrl = `data:image/svg+xml;base64,${btoa(
          selected ? featureType.icon.selectedIconSvg ?? '' : featureType.icon.iconSvg
        )}`;

        const marker = L.marker(latlng, {
          icon: L.icon({
            ...featureType.icon.options,
            className: featureType.label,
            iconUrl,
          }),
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          alt: feature.properties[featureType.idField],
        });

        marker.on(
          'click',
          /* istanbul ignore next */ () => {
            const { description, typeValue, idField }: Partial<FeatureType> = featureType;
            const item = {
              id: feature.properties[idField],
              type: typeValue,
              description,
              iconUrl: `data:image/svg+xml;base64,${btoa(featureType.icon.iconSvg)}`,
            } as Item;

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
