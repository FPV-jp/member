import { Disclosure, DisclosurePanel } from '@headlessui/react'
import { DesktopNavigationMenu, DesktopNavigationUserMenu, MobileNavigationMenu, MobileNavigationUserMenu, Button, IndigoButton, IconButton, MobileIconButton, HamburgerButton } from './DashboardMenu'
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { KeyIcon } from '@heroicons/react/20/solid'
import { Loading, Error } from './Components'

import { Users } from './Users'
import { Users2 } from './Users2'

// import { useEffect } from 'react'

const navigation = [
  { name: 'Dashboard', href: '/', current: true },
  { name: 'Users', href: '/users', current: false },
  { name: 'Users2', href: '/users2', current: false },
]

const userNavigation = [
  { name: 'Your Profile', href: '#' },
  { name: 'Settings', href: '#' },
  { name: 'Sign out', href: '#' },
]

const ProtectedUsers = withAuthenticationRequired(Users)
const ProtectedUsers2 = withAuthenticationRequired(Users2)

export default function Dashboard() {
  const { isLoading, error, isAuthenticated, user, loginWithRedirect, logout } = useAuth0()
  const { pathname } = useLocation()

  // useEffect(() => {
  //   console.log(user)
  // }, [user]);

  if (isLoading) {
    return <Loading />
  }

  return (
    <>
      {error && <Error message={error.message} />}
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-gray-800">
          <DesktopNavigation user={user} pathname={pathname} navigation={navigation} userNavigation={userNavigation} isAuthenticated={isAuthenticated} loginWithRedirect={loginWithRedirect} logout={logout} />
          <MobileNavigation user={user} navigation={navigation} userNavigation={userNavigation} isAuthenticated={isAuthenticated} logout={logout} />
        </Disclosure>
        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{pathname}</h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <Routes>
              <Route path='/' />
              <Route path='/users' element={<ProtectedUsers />} />
              <Route path='/users2' element={<ProtectedUsers2 />} />
            </Routes>
          </div>
        </main>
      </div>
    </>
  )
}

/* eslint-disable react/prop-types */
function DesktopNavigation({ user, pathname, navigation, userNavigation, isAuthenticated, loginWithRedirect, logout }) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex h-16 items-center justify-between">
        <div className="flex items-center">
          <div className="shrink-0">
            <img alt="Your Company" src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500" className="size-8" />
          </div>
          <DesktopNavigationMenu pathname={pathname} navigation={navigation} />
        </div>
        <div className="hidden md:block">
          {isAuthenticated ? (<>
            <div className="ml-4 flex items-center md:ml-6">
              <IconButton>
                <span className="absolute -inset-1.5" />
                <span className="sr-only">View notifications</span>
                <BellIcon aria-hidden="true" className="size-6" />
              </IconButton>
              {/* Profile dropdown */}
              <DesktopNavigationUserMenu user={user} userNavigation={userNavigation} logout={logout} />
            </div>
          </>) : (<>
            <div className="ml-4 flex items-center md:ml-6">
              <IndigoButton onClick={() => loginWithRedirect()}>
                <KeyIcon aria-hidden="true" className="-ml-0.5 mr-1.5 size-5" />
                Login
              </IndigoButton>
            </div>
          </>)}
        </div>
        <div className="-mr-2 flex md:hidden">
          {/* Mobile menu button */}
          {isAuthenticated ? (<>
            <HamburgerButton>
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="block size-6 group-data-[open]:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-[open]:block" />
            </HamburgerButton>
          </>) : (<>
            <IndigoButton onClick={() => loginWithRedirect()}>
              <KeyIcon aria-hidden="true" className="-ml-0.5 mr-1.5 size-5" />
              Login
            </IndigoButton>
          </>)}
        </div>
      </div>
    </div>
  )
}

/* eslint-disable react/prop-types */
function MobileNavigation({ user, navigation, userNavigation, isAuthenticated, logout }) {
  return (
    <DisclosurePanel className="md:hidden">
      <MobileNavigationMenu navigation={navigation} />
      <div className="border-t border-gray-700 pb-3 pt-4">
        {isAuthenticated &&
          <div className="flex items-center px-5">
            <div className="shrink-0">
              <img alt="" src={user.picture} className="size-10 rounded-full" />
            </div>
            <div className="ml-3">
              <div className="text-base/5 font-medium text-white">{user.name}</div>
              <div className="text-sm font-medium text-gray-400">{user.email}</div>
            </div>
            <MobileIconButton>
              <span className="absolute -inset-1.5" />
              <span className="sr-only">View notifications</span>
              <BellIcon aria-hidden="true" className="size-6" />
            </MobileIconButton>
          </div>
        }
        <MobileNavigationUserMenu userNavigation={userNavigation} logout={logout} />
      </div>
    </DisclosurePanel>
  )
}
