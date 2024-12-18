import { useState } from 'react'
import { Disclosure } from '@headlessui/react'
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react'
import * as ReactRouter from 'react-router-dom'

import * as DashboardNavigation from './DashboardNavigation'
import * as Components from '../component/Components'

import Bento from './Bento'
import UserREST from '../example-user/UserREST'
import UserGraphQL from '../example-user/UserGraphQL'
import Wasabi from '../example-wasabi/Wasabi'
import Mapbox from '../example-mapbox/Mapbox'

import Form from '../example-form/Form'

import Profile from '../user-menu/Profile'
import Settings from '../user-menu/Settings'
import Notification from '../user-menu/Notification'

const ProtectedUserREST = withAuthenticationRequired(UserREST)
const ProtectedUserGraphQL = withAuthenticationRequired(UserGraphQL)
const ProtectedWasabi = withAuthenticationRequired(Wasabi)
const ProtectedMapbox = withAuthenticationRequired(Mapbox)

const ProtectedProfile = withAuthenticationRequired(Profile)
const ProtectedNotification = withAuthenticationRequired(Notification)

export default function Dashboard() {
  const { isLoading, error, isAuthenticated, user, loginWithRedirect, logout } = useAuth0()
  const { pathname: currentpath } = ReactRouter.useLocation()
  const [notificationOpen, setNotificationOpen] = useState(false)

  const navigation = [
    { name: 'Dashboard', path: '/', title: 'Dashboard' },
    { name: 'UserREST', path: '/example-user-rest', title: 'REST API Example', current: false },
    { name: 'UserGraphQL', path: '/example-user-graphql', title: 'GraphQL Example', current: false },
    { name: 'Wasabi', path: '/example-wasabi', title: 'Wasabi Example', current: false },
    { name: 'Mapbox', path: '/example-mapbox', title: 'Mapbox Example', current: false },
    { name: 'Form', path: '/example-form', title: 'Form Example', current: false },
  ]

  const userNavigation = [
    { name: 'Your Profile', path: '/profile', onClick: () => { } },
    { name: 'Settings', path: '/settings', onClick: () => { } },
    { name: 'Sign out', path: '#', onClick: logout },
  ]

  if (isLoading) {
    return <Components.Loading />
  }

  return (
    <>
      {error && <Components.Error message={error.message} />}
      <div className='min-h-full'>
        <Disclosure as='nav' className='bg-gray-800'>
          <DashboardNavigation.DesktopNavigation {...{
            user,
            currentpath,
            navigation,
            userNavigation,
            isAuthenticated,
            loginWithRedirect,
            setNotificationOpen,
          }} />
          <DashboardNavigation.MobileNavigation {...{
            user,
            navigation,
            userNavigation,
            isAuthenticated,
            setNotificationOpen,
          }} />
        </Disclosure>
        {navigation.find((nav) => nav.path === currentpath) && (
          <header className="bg-white shadow">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-between">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                {navigation.find((nav) => nav.path === currentpath).title}
              </h1>
              {'/example-mapbox' == currentpath &&
                <div className="inline-flex rounded-md shadow-sm" role="group">
                  <button type="button" className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700">
                    Left
                  </button>
                  <button type="button" className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 -ml-px hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700" >
                    Middle
                  </button>
                  <button type="button" className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 -ml-px rounded-r-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700" >
                    Right
                  </button>
                </div>
              }
            </div>
          </header>
        )}
        <main>
          <div className='mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8'>
            <ProtectedNotification {...{
              notificationOpen,
              setNotificationOpen,
            }} />
            <ReactRouter.Routes>
              <ReactRouter.Route path='/' element={<Bento />} />
              <ReactRouter.Route path='/example-user-rest' element={<ProtectedUserREST />} />
              <ReactRouter.Route path='/example-user-graphql' element={<ProtectedUserGraphQL />} />
              <ReactRouter.Route path='/example-wasabi' element={<ProtectedWasabi />} />
              <ReactRouter.Route path='/example-mapbox' element={<ProtectedMapbox />} />
              <ReactRouter.Route path='/example-form' element={<Form />} />
              <ReactRouter.Route path='/profile' element={<ProtectedProfile />} />
              <ReactRouter.Route path='/settings' element={<Settings />} />
              <ReactRouter.Route path='/404' element={<Components.NotFound />} />
              <ReactRouter.Route path='*' element={<ReactRouter.Navigate to='/404' replace />} />
            </ReactRouter.Routes>
          </div>
        </main>
      </div>
    </>
  )
}
