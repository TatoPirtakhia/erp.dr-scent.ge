import React, { useState } from 'react';
import { useControl, Marker } from 'react-map-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
const GeocoderControl = ({
  mapboxAccessToken,
  marker = true,
  position,
  onLoading = () => {},
  onResults = () => {},
  onResult = () => {},
  onError = () => {},
  ...restProps
}) => {
  const [markerElement, setMarkerElement] = useState(null);

  const geocoder = useControl(
    () => {
      const ctrl = new MapboxGeocoder({
        ...restProps,
        marker: false,
        accessToken: mapboxAccessToken,
      });

      ctrl.on('loading', onLoading);
      ctrl.on('results', onResults);
      ctrl.on('result', evt => {
        onResult(evt);

        const { result } = evt;
        const location =
          result &&
          (result.center || (result.geometry?.type === 'Point' && result.geometry.coordinates));

        if (location && marker) {
          setMarkerElement(
            <Marker {...marker} longitude={location[0]} latitude={location[1]} />
          );
        } else {
          setMarkerElement(null);
        }
      });
      ctrl.on('error', onError);

      return ctrl;
    },
    { position }
  );

  if (geocoder._map) {
    if (geocoder.getProximity() !== restProps.proximity && restProps.proximity !== undefined) {
      geocoder.setProximity(restProps.proximity);
    }
    if (geocoder.getRenderFunction() !== restProps.render && restProps.render !== undefined) {
      geocoder.setRenderFunction(restProps.render);
    }
    if (geocoder.getLanguage() !== restProps.language && restProps.language !== undefined) {
      geocoder.setLanguage(restProps.language);
    }
    if (geocoder.getZoom() !== restProps.zoom && restProps.zoom !== undefined) {
      geocoder.setZoom(restProps.zoom);
    }
    if (geocoder.getFlyTo() !== restProps.flyTo && restProps.flyTo !== undefined) {
      geocoder.setFlyTo(restProps.flyTo);
    }
    if (geocoder.getPlaceholder() !== restProps.placeholder && restProps.placeholder !== undefined) {
      geocoder.setPlaceholder(restProps.placeholder);
    }
    if (geocoder.getCountries() !== restProps.countries && restProps.countries !== undefined) {
      geocoder.setCountries(restProps.countries);
    }
    if (geocoder.getTypes() !== restProps.types && restProps.types !== undefined) {
      geocoder.setTypes(restProps.types);
    }
    if (geocoder.getMinLength() !== restProps.minLength && restProps.minLength !== undefined) {
      geocoder.setMinLength(restProps.minLength);
    }
    if (geocoder.getLimit() !== restProps.limit && restProps.limit !== undefined) {
      geocoder.setLimit(restProps.limit);
    }
    if (geocoder.getFilter() !== restProps.filter && restProps.filter !== undefined) {
      geocoder.setFilter(restProps.filter);
    }
    if (geocoder.getOrigin() !== restProps.origin && restProps.origin !== undefined) {
      geocoder.setOrigin(restProps.origin);
    }
  }

  return markerElement;
};

export default GeocoderControl;
