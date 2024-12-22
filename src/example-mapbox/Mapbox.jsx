// import { useEffect, useRef } from 'react';
// import mapboxgl from 'mapbox-gl';
// import 'mapbox-gl/dist/mapbox-gl.css'
// import { useEffect, useState } from 'react'
// import Map, { Marker, Popup } from 'react-map-gl'
import { useState, useEffect } from 'react'
import Map from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

// import * as Components from '../component/Components'

export function MapboxHeader() {
  return (
    <div className='inline-flex rounded-md shadow-sm' role='group'>
      <button type='button' className='rounded-l-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700'>
        Left
      </button>
      <button type='button' className='-ml-px border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700'>
        Middle
      </button>
      <button type='button' className='-ml-px rounded-r-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700'>
        Right
      </button>
    </div>
  )
}

export default function ExampleMapbox() {
  const [location, setLocation] = useState(null)
  const [error, setError] = useState(null)
  const [mapStyle, setMapStyle] = useState('mapbox://styles/mapbox/streets-v12')
  const [mapboxAccessToken, setMapboxAccessToken] = useState('pk.eyJ1IjoicmVsaWNzOSIsImEiOiJjbHMzNHlwbDIwNDczMmtvM2xhNWR0ZzVtIn0.whCzeh6XW7ju4Ja6DR0imw')

  // mapStyle="mapbox://styles/mapbox/standard"
  // mapStyle="mapbox://styles/mapbox/streets-v11"
  // mapStyle='mapbox://styles/mapbox/outdoors-v12'
  // mapStyle='mapbox://styles/mapbox/dark-v11'

  useEffect(() => {
    window.navigator.geolocation.getCurrentPosition(
      (position) => {
        const { accuracy, altitude, altitudeAccuracy, heading, latitude, longitude, speed } = position.coords
        setLocation({ accuracy, altitude, altitudeAccuracy, heading, latitude, longitude, speed })
      },
      (err) => setError(`ERROR(${err.code}): ${err.message}`),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
    )
  }, [])

  if (error) {
    return <p>位置情報の取得に失敗しました: {error}</p>
  }

  if (!location) {
    return <p>位置情報を取得中...</p>
  }

  return (
    <Map
      initialViewState={{
        latitude: location.latitude,
        longitude: location.longitude,
        zoom: 16,
      }}
      style={{ width: '100%', height: '78vh' }}
      mapStyle={mapStyle}
      mapboxAccessToken={mapboxAccessToken}
      onClick={(event) => {
        console.log(event)
      }}
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
  )
}
