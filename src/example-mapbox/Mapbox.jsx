// import { useEffect, useRef } from 'react';
// import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css'
// import { useEffect, useState } from 'react'
import Map, { Marker, Popup } from 'react-map-gl'

import 'mapbox-gl/dist/mapbox-gl.css';

export default function MapboxExample() {
  // const mapContainerRef = useRef();
  // const mapRef = useRef();

  // useEffect(() => {
  //   mapboxgl.accessToken = 'pk.eyJ1IjoicmVsaWNzOSIsImEiOiJjbHMzNHlwbDIwNDczMmtvM2xhNWR0ZzVtIn0.whCzeh6XW7ju4Ja6DR0imw';

  //   mapRef.current = new mapboxgl.Map({
  //     container: mapContainerRef.current,
  //     center: [-74.5, 40], // starting position [lng, lat]
  //     zoom: 9 // starting zoom
  //   });
  // });

  return (
    <Map
      initialViewState={{
        latitude: 35.7030639,
        longitude: 139.7690916,
        zoom: 16,
      }}
      style={{ width: '100%', height: '78vh' }}
      mapStyle='mapbox://styles/mapbox/streets-v11'
      // mapStyle='mapbox://styles/mapbox/satellite-v11'
      // mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
      mapboxAccessToken='pk.eyJ1IjoicmVsaWNzOSIsImEiOiJjbHMzNHlwbDIwNDczMmtvM2xhNWR0ZzVtIn0.whCzeh6XW7ju4Ja6DR0imw'
    // onClick={(event) => {
    //   // setSelectMarker(null)
    //   editMode &&
    //     setSelectPoint({
    //       latitude: event.lngLat.lat,
    //       longitude: event.lngLat.lng,
    //     })
    // }}
    >
      {/* {!editMode &&
            data?.allFlightPoints.map((flightPoint) => {
              return (
                <Marker
                  key={flightPoint.id}
                  latitude={flightPoint.latitude}
                  longitude={flightPoint.longitude}
                  onClick={async () => {
                    setSelectMarkerImage(null)
                    setSelectMarker(flightPoint)
                    const target = await downloadFileFromWasabi((await getIdTokenClaims()).__raw, import.meta.env.VITE_WASABI_BUCKET, flightPoint.marker_image, false)
                    setSelectMarkerImage(target.fileBlob)
                  }}
                >
                  {thumbnail(flightPoint)}
                </Marker>
              )
            })} */}

      {/* {!editMode && selectMarker && (
            <Popup latitude={selectMarker.latitude} longitude={selectMarker.longitude} closeButton={true} closeOnClick={false} onClose={() => setSelectMarker(null)}>
              {selectMarkerImage ? <img src={URL.createObjectURL(selectMarkerImage)} alt={selectMarker.create_user} /> : <div>Loading...</div>}
            </Popup>
          )}

          {editMode && selectPoint && (
            <Popup latitude={selectPoint.latitude} longitude={selectPoint.longitude} closeButton={false} closeOnClick={false} onClose={() => setSelectPoint(null)}>
              <button type='button' onClick={() => setOpenPointForm(true)} className='rounded-md bg-indigo-600 px-3 py-2 text-sm text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
                ここに追加
              </button>
            </Popup>
          )} */}
    </Map>
  );
};
