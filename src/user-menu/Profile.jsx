import { useProfile } from '../core'
import { useEffect, useState } from 'react'

export default function Example() {
  const getProfile = useProfile()

  const [profile, setProfile] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setProfile(
        Object.entries(await getProfile()).reduce((acc, [key, val]) => {
          if (typeof val === 'boolean') {
            acc[key] = String(val)
          } else if (key === 'picture') {
            acc[key] = <img alt='' src={val} className='size-10 rounded-full' />
          } else if (key === 'token') {
            acc[key] = <pre className='max-w-3xl whitespace-pre-wrap break-words'>{val}</pre>
          } else if (key === 'iat' || key === 'exp') {
            acc[key] = new Date(val * 1000).toISOString()
          } else {
            acc[key] = val
          }
          return acc
        }, {}),
      )
    }
    fetchData()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <div className='px-4 sm:px-0'>
        <h3 className='text-base/7 font-semibold text-gray-900'>Auth0 Information</h3>
        <p className='mt-1 max-w-2xl text-sm/6 text-gray-500'>Personal details and application.</p>
      </div>
      <div className='mt-6 border-t border-gray-100'>
        <dl className='divide-y divide-gray-100'>
          {profile &&
            Object.entries(profile).map(([key, val]) => (
              <div key={key} className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                <dt className='text-sm/6 font-medium text-gray-900'>{key}</dt>
                <dd className='mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0'>{val}</dd>
              </div>
            ))}
        </dl>
      </div>
    </div>
  )
}
