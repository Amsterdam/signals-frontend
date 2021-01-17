import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { FunctionComponent } from 'react';
import L from 'leaflet';
import MarkerCluster from 'components/MarkerCluster';
import type { GeoJSON as GeoJSONLayer, LatLng } from 'leaflet';
import type { Point, Feature, FeatureCollection } from 'geojson';
import WfsDataContext from '../WfsLayer/context';
import { featureTolocation } from 'shared/services/map-location';
import type { DataLayerProps } from '../types';

export const ContainerLayer: FunctionComponent<DataLayerProps> = ({ featureTypes }) => {
  const [layerInstance, setLayerInstance] = useState<GeoJSONLayer>();
  const data = useContext<FeatureCollection>(WfsDataContext);

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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    feature => featureTypes.find(({ typeField, typeValue }) => feature.properties[typeField] === typeValue),
    [featureTypes]
  );

  const options: L.GeoJSONOptions<Record<string, string | undefined>> = useMemo(
    () => ({
      pointToLayer: /* istanbul ignore next */ (feature, latlng: LatLng) => {
        const featureType = getFeatureType(feature);
        if (!featureType) return L.marker({ ...latlng, lat: 0, lng: 0 });

        return L.marker(latlng, {
          icon: L.icon({
            ...featureType.icon.options,
            className: featureType.label,
            iconUrl: `data:image/svg+xml;base64,${btoa(featureType.icon.iconSvg)}`,
          }),
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          alt: feature.properties[featureType.idField],
        });
      },
    }),
    [getFeatureType]
  );

  useEffect(() => {
    if (layerInstance) {
      layerInstance.clearLayers();
      data.features.forEach(feature => {
        const pointFeature: Feature<Point, any> = { ...feature, geometry: { ...(feature.geometry as Point) } };
        const { coordinates } = pointFeature.geometry;
        const latlng = featureTolocation({ coordinates });
        const marker = options.pointToLayer?.(pointFeature, latlng);
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
      }
    };
  }, [layerInstance, data, options]);

  return <MarkerCluster clusterOptions={clusterOptions} setInstance={setLayerInstance} />;
};

export default ContainerLayer;

