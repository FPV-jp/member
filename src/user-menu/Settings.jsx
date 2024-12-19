import { useEffect, useState } from 'react'
import * as Components from '../component/Components'

export default function Example() {
  const [settings, setSettings] = useState()

  // console.log(window.navigator)
  // console.log(navigator)
  useEffect(() => {
    const newSettings = {}
    const fetchData = async () => {
      const battery = await window.navigator.getBattery()
      newSettings.battery = {
        charging: battery.charging,
        chargingTime: battery.chargingTime,
        dischargingTime: battery.dischargingTime,
        level: battery.level,
      }
      const adapter = await window.navigator.gpu.requestAdapter()
      newSettings.gpu = {
        architecture: adapter.info.architecture,
        description: adapter.info.description,
        device: adapter.info.device,
        vendor: adapter.info.vendor,
      }
      const FullHD = { framerate: 30, width: 1920, height: 1080 }
      const UltraHD = { framerate: 60, width: 3840, height: 2160 }
      newSettings.decodingSupport = [
        { codec: 'H.264', decoding: { type: 'media-source', video: { bitrate: 5000000, contentType: 'video/mp4; codecs="avc1.42E01E"', ...FullHD } } },
        { codec: 'H.265(HEVC)', decoding: { type: 'media-source', video: { bitrate: 8000000, contentType: 'video/mp4; codecs="hvc1.1.6.L93.B0"', ...UltraHD } } },
        { codec: 'VP8', decoding: { type: 'media-source', video: { bitrate: 1000000, contentType: 'video/webm; codecs="vp8"', ...FullHD } } },
        { codec: 'VP9', decoding: { type: 'media-source', video: { bitrate: 2000000, contentType: 'video/webm; codecs="vp09.00.10.08"', ...UltraHD } } },
        { codec: 'AV1', decoding: { type: 'media-source', video: { bitrate: 3000000, contentType: 'video/mp4; codecs="av01.0.05M.08"', ...UltraHD } } },
        { codec: 'EVC', decoding: { type: 'media-source', video: { bitrate: 4000000, contentType: 'video/mp4; codecs="evc1.0.1"', ...FullHD } } },
        { codec: 'LC-EVC', decoding: { type: 'media-source', video: { bitrate: 3500000, contentType: 'video/mp4; codecs="lcevc.1.1"', ...FullHD } } },
      ]
      for (const config of newSettings.decodingSupport) {
        config.support = await window.navigator.mediaCapabilities.decodingInfo(config.decoding)
      }
      setSettings((prevSettings) => ({ ...prevSettings, ...newSettings }))
    }
    fetchData()

    window.navigator.geolocation.getCurrentPosition(
      (position) => {
        newSettings.geolocation = {
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          altitudeAccuracy: position.coords.altitudeAccuracy,
          heading: position.coords.heading,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          speed: position.coords.speed,
        }
        setSettings((prevSettings) => ({ ...prevSettings, ...newSettings }))
      },
      (err) => console.warn(`ERROR(${err.code}): ${err.message}`),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
    )
    newSettings.oscpu = {
      oscpu: window.navigator.oscpu || window.navigator.platform,
      hardwareConcurrency: window.navigator.hardwareConcurrency,
      deviceMemory: window.navigator.deviceMemory,
    }
    if (window.navigator.connection) {
      newSettings.network = {
        downlink: window.navigator.connection.downlink,
        downlinkMax: window.navigator.connection.downlinkMax,
        effectiveType: window.navigator.connection.effectiveType,
        rtt: window.navigator.connection.rtt,
        saveData: window.navigator.connection.saveData,
        type: window.navigator.connection.type,
      }
    }
    setSettings((prevSettings) => ({ ...prevSettings, ...newSettings }))
  }, [])

  useEffect(() => {
    console.log(settings)
  }, [settings])

  if (!settings) {
    return <Components.Loading />
  }

  return (
    <div>
      <div className='px-4 sm:px-0'>
        <h3 className='text-base/7 font-semibold text-gray-900'>Applicant Information</h3>
        <p className='mt-1 max-w-2xl text-sm/6 text-gray-500'>Personal details and application.</p>
      </div>
      <div className='mt-6 border-t border-gray-100'>
        <dl className='divide-y divide-gray-100'>
          <div className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
            <dt className='text-sm/6 font-medium text-gray-900'>userAgent</dt>
            <dd className='mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0'>{window.navigator.userAgent}</dd>
          </div>

          <div className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
            <dt className='text-sm/6 font-medium text-gray-900'>Device Information</dt>
            <dd className='mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
              <ul role='list' className='divide-y divide-gray-100 rounded-md border border-gray-200'>
                {settings?.oscpu &&
                  Object.entries(settings.oscpu).map(([key, val]) => (
                    <li key={key} className='flex items-center justify-between py-4 pl-4 pr-5 text-sm/6'>
                      <div className='flex w-0 flex-1 items-center'>
                        {key}
                        <div className='ml-4 flex min-w-0 flex-1 gap-2'>
                          <span className='shrink-0 text-gray-400'>resume_back_end_developer.pdf</span>
                        </div>
                      </div>
                      <div className='ml-4 shrink-0'>{val}</div>
                    </li>
                  ))}
              </ul>
            </dd>
          </div>

          <div className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
            <dt className='text-sm/6 font-medium text-gray-900'>Network Information</dt>
            <dd className='mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
              <ul role='list' className='divide-y divide-gray-100 rounded-md border border-gray-200'>
                {settings?.network &&
                  Object.entries(settings.network).map(([key, val]) => (
                    <li key={key} className='flex items-center justify-between py-4 pl-4 pr-5 text-sm/6'>
                      <div className='flex w-0 flex-1 items-center'>
                        {key}
                        <div className='ml-4 flex min-w-0 flex-1 gap-2'>
                          <span className='shrink-0 text-gray-400'>resume_back_end_developer.pdf</span>
                        </div>
                      </div>
                      <div className='ml-4 shrink-0'>{val}</div>
                    </li>
                  ))}
              </ul>
            </dd>
          </div>

          <div className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
            <dt className='text-sm/6 font-medium text-gray-900'>Geolocation</dt>
            <dd className='mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
              <ul role='list' className='divide-y divide-gray-100 rounded-md border border-gray-200'>
                {settings?.geolocation &&
                  Object.entries(settings.geolocation).map(([key, val]) => (
                    <li key={key} className='flex items-center justify-between py-4 pl-4 pr-5 text-sm/6'>
                      <div className='flex w-0 flex-1 items-center'>
                        {key}
                        <div className='ml-4 flex min-w-0 flex-1 gap-2'>
                          <span className='shrink-0 text-gray-400'>resume_back_end_developer.pdf</span>
                        </div>
                      </div>
                      <div className='ml-4 shrink-0'>{val}</div>
                    </li>
                  ))}
              </ul>
            </dd>
          </div>

          <div className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
            <dt className='text-sm/6 font-medium text-gray-900'>GPU Information</dt>
            <dd className='mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
              <ul role='list' className='divide-y divide-gray-100 rounded-md border border-gray-200'>
                {settings?.gpu &&
                  Object.entries(settings.gpu).map(([key, val]) => (
                    <li key={key} className='flex items-center justify-between py-4 pl-4 pr-5 text-sm/6'>
                      <div className='flex w-0 flex-1 items-center'>
                        {key}
                        <div className='ml-4 flex min-w-0 flex-1 gap-2'>
                          <span className='shrink-0 text-gray-400'>resume_back_end_developer.pdf</span>
                        </div>
                      </div>
                      <div className='ml-4 shrink-0'>{val}</div>
                    </li>
                  ))}
              </ul>
            </dd>
          </div>

          <div className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
            <dt className='text-sm/6 font-medium text-gray-900'>Battery Information</dt>
            <dd className='mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
              <ul role='list' className='divide-y divide-gray-100 rounded-md border border-gray-200'>
                {settings?.battery &&
                  Object.entries(settings.battery).map(([key, val]) => (
                    <li key={key} className='flex items-center justify-between py-4 pl-4 pr-5 text-sm/6'>
                      <div className='flex w-0 flex-1 items-center'>
                        {key}
                        <div className='ml-4 flex min-w-0 flex-1 gap-2'>
                          <span className='shrink-0 text-gray-400'>resume_back_end_developer.pdf</span>
                        </div>
                      </div>
                      <div className='ml-4 shrink-0'>{val}</div>
                    </li>
                  ))}
              </ul>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
