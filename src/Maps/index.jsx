import { Button, Modal, Segmented } from 'antd';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'antd/dist/reset.css'; // Ensure Ant Design CSS is imported
import * as React from 'react';
import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import Map, {
    Marker,
    Popup,
    NavigationControl,
    FullscreenControl,
    ScaleControl,
    GeolocateControl,
} from 'react-map-gl';
import { Carousel } from 'antd';
import {
    ExportOutlined
} from "@ant-design/icons"
import Pin from './pin';
import { getTranslation } from '../lang/translationUtils';
import { useSelector } from 'react-redux';
import GeocoderControl from './geocoder-control';

const MapBox = ({ visible, close, onSubmit, data, enableNewPin, latitude, longitude }) => {


    const theme = useSelector(state => state.theme.currentTheme);
    const [popupInfo, setPopupInfo] = useState(null);
    const [newPin, setNewPin] = useState(null);
    const [mapStyle, setMapStyle] = useState(theme);
    const [mainLocation, setMainLocation] = useState({
        latitude,
        longitude
    });
    const [zoom, setZoom] = useState(10);

    const mapRef = useRef();

    const onSelectCity = useCallback(({ longitude, latitude }) => {
        mapRef.current?.flyTo({ center: [longitude, latitude], zoom: 14, duration: 2000 });
    }, []);

    useEffect(() => {
        if (latitude && longitude && enableNewPin) {
            setNewPin({
                latitude,
                longitude
            });
        }
    }, [latitude, longitude])



    const handleMapClick = useCallback((event) => {
        const { lngLat } = event;
        setNewPin({
            latitude: lngLat.lat,
            longitude: lngLat.lng
        });
    }, []);

    const handleMarkerClick = useCallback((city) => {
        setPopupInfo(city);
        setMainLocation({
            latitude: city.latitude,
            longitude: city.longitude
        });
        setZoom(12); // Adjust zoom level as needed
        onSelectCity(city)
    }, []);

    const handleMarkerDrag = useCallback((event) => {
        const { lngLat } = event;
        setNewPin({
            latitude: lngLat.lat,
            longitude: lngLat.lng
        });
    }, []);

    const handleSave = () => {
        if (newPin && enableNewPin) {
            onSubmit({
                longitude: newPin.longitude,
                latitude: newPin.latitude,
            });
            close()
        }
    }

    const handleGeolocate = useCallback((event) => {
        const { coords } = event;
        setNewPin({
            latitude: coords.latitude,
            longitude: coords.longitude
        });
        setMainLocation({
            latitude: coords.latitude,
            longitude: coords.longitude
        });
        setZoom(15); // Reset zoom level or adjust as needed
    }, []);

    const pins = useMemo(
        () =>
            data.map((elm, index) => (
                <Marker
                    key={`marker-${index}`}
                    longitude={elm.longitude}
                    latitude={elm.latitude}
                    anchor="bottom"
                    className='cursor-pointer'
                    onClick={(e) => {
                        e.originalEvent.stopPropagation();
                        handleMarkerClick(elm);
                    }}
                >
                    <Pin color={'#ff5630'} size={25} />
                </Marker>
            )),
        [handleMarkerClick]
    );

    const openMaps = (latitude, longitude) => {
        // URL for Google Maps (works on Android and also in browsers)
        const googleMapsUrl = `google.navigation:q=${latitude},${longitude}`;

        // URL for Apple Maps (works on iOS devices)
        const appleMapsUrl = `maps:0,0?q=${latitude},${longitude}`;

        // User Agent detection to decide which URL to use
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;

        if (/android/i.test(userAgent)) {
            // For Android devices, try to open Google Maps
            window.location.href = googleMapsUrl;
        } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            // For iOS devices, try to open Apple Maps
            window.location.href = appleMapsUrl;
        } else {
            // Fallback to Google Maps in the browser for other devices
            window.location.href = `https://www.google.com/maps?q=${latitude},${longitude}`;
        }
    };

    return (
        <Modal open={visible} onCancel={close} width={900} footer={null}>
            <div className='mt-[23px] mb-3 flex flex-col justify-center gap-4'>
                <div>
                    <Segmented
                        defaultValue={mapStyle}
                        options={[
                            { label: getTranslation('Streets'), value: 'streets' },
                            { label: getTranslation('Outdoors'), value: 'outdoors' },
                            { label: getTranslation('Light'), value: 'light' },
                            { label: getTranslation('Dark'), value: 'dark' },
                            { label: getTranslation('Satellite'), value: 'satellite' },
                        ]}
                        onChange={(value) => setMapStyle(value)}
                    />
                </div>
                <Map
                    ref={mapRef}
                    initialViewState={{
                        latitude: mainLocation.latitude,
                        longitude: mainLocation.longitude,
                        zoom: zoom,
                        bearing: 0,
                        pitch: 0
                    }}
                    mapStyle={`mapbox://styles/mapbox/${mapStyle}-v9`}
                    mapboxAccessToken={import.meta.env.VITE_MAP_BOX_TOKEN}
                    style={{ width: '100%', height: '50vh' }}
                    onClick={handleMapClick}
                >
                    <GeocoderControl mapboxAccessToken={import.meta.env.VITE_MAP_BOX_TOKEN} position="top-left" />
                    <GeolocateControl
                        position="top-left"
                        onGeolocate={handleGeolocate}
                        onError={(err) => console.error('Geolocation error:', err)}
                    />

                    <FullscreenControl position="top-left" />
                    <NavigationControl position="top-right" />
                    <ScaleControl style={{
                        backgroundImage: "linear-gradient(to right, #8a2387, #e94057, #f27121)",
                        border: "none",
                        color: "white",
                        fontWeight: 700,
                        lineHeight: '14px',
                        borderRadius: '4px',
                    }} />

                    {pins}

                    {newPin && enableNewPin && (
                        <Marker
                            longitude={newPin.longitude}
                            latitude={newPin.latitude}
                            anchor="bottom"
                            draggable
                            onDrag={handleMarkerDrag}
                        >
                            <Pin color={'green'} size={30} />
                        </Marker>
                    )}

                    {popupInfo && (
                        <Popup
                            anchor="top"
                            longitude={Number(popupInfo.longitude)}
                            latitude={Number(popupInfo.latitude)}
                            onClose={() => setPopupInfo(null)}
                        >
                            <div className=' -mt-2' >
                                <p className='mb-0 text-white font-bold text-[18px] font-noto_georgian '>{popupInfo.brand_name} </p>
                                <p className='font-noto_georgian text-white mb-0'>{popupInfo.address}<br />{popupInfo.state}, {popupInfo.city}</p>
                                <p className='mb-0 mt-1 font-noto_georgian'>Lan: {popupInfo.latitude}</p>
                                <p className='mb-0 font-noto_georgian'>Long: {popupInfo.longitude}</p>
                            </div>
                            {popupInfo?.images?.length > 0 ? (
                                <Carousel autoplay effect="fade">
                                    {popupInfo.images.map((image, index) => (
                                        <div key={index}>
                                            <img width="100%" src={image} alt={`Slide ${index + 1}`} />
                                        </div>
                                    ))}
                                </Carousel>
                            ) : (
                                null
                            )}
                        </Popup>
                    )}
                </Map>
            </div>
            <div className='flex items-center justify-between'>
                <div >

                    <Button type='link' onClick={() => openMaps(latitude, longitude)}>
                        {getTranslation("sidenav.client.getDirection")} <ExportOutlined />
                    </Button>
                </div>
                <div className="flex gap-2">
                    {!enableNewPin && <Button onClick={() => close()}>{getTranslation("sidenav.client.Cancel")}</Button>}
                    {enableNewPin && <Button type="primary" onClick={handleSave}>{getTranslation("sidenav.client.Add")}</Button>}
                </div>
            </div>
        </Modal>
    );
};

export default MapBox;
