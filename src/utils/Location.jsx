import React, { useState, useEffect, useRef } from 'react';

const Location = () => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);
  const mapRef = useRef(null);

  const success = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    setLocation({ latitude, longitude });
  };

  const handleError = () => {
    setError("Unable to retrieve your location");
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, handleError);
    } else {
      setError("Geolocation not supported");
    }
  }, []);

  useEffect(() => {
    if (location.latitude && location.longitude && window.google) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: location.latitude, lng: location.longitude },
        zoom: 15,
      });
      new window.google.maps.Marker({
        position: { lat: location.latitude, lng: location.longitude },
        map: map,
      });
    }
  }, [location]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {location.latitude && location.longitude ? (
        <div>
          <div>Latitude: {location.latitude}, Longitude: {location.longitude}</div>
          <div ref={mapRef} style={{ height: '400px', width: '100%' }} />
        </div>
      ) : (
        <div>Loading location...</div>
      )}
    </div>
  );
};

export default Location;
