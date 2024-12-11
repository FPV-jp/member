import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'

import { DesktopNavigationMenu, DesktopNavigationUserMenu, MobileNavigationMenu, MobileNavigationUserMenu, Button, IndigoButton, IconButton } from './DashboardMenu'
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react'
import { Route, Routes, useLocation, Link } from 'react-router-dom'
import { useEffect } from 'react'

import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { KeyIcon } from '@heroicons/react/20/solid'

const user = {
  name: 'Tom Cook',
  email: 'tom@example.com',
  imageUrl:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
}

const navigation = [
  { name: 'Dashboard', href: '#', current: true },
  { name: 'Team', href: '#', current: false },
  { name: 'Projects', href: '#', current: false },
  { name: 'Calendar', href: '#', current: false },
  { name: 'Reports', href: '#', current: false },
]

const userNavigation = [
  { name: 'Your Profile', href: '#' },
  { name: 'Settings', href: '#' },
  { name: 'Sign out', href: '#' },
]

export default function Dashboard() {
  const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0()
  const { pathname } = useLocation()

  useEffect(() => {
    console.log(user)
  }, [user]);

  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-gray-800">
          <DesktopNavigation navigation={navigation} userNavigation={userNavigation} isAuthenticated={isAuthenticated} loginWithRedirect={loginWithRedirect} logout={logout} />
          <MobileNavigation navigation={navigation} userNavigation={userNavigation} />
        </Disclosure>
        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{/* Your content */}</div>
        </main>
      </div>
    </>
  )
}

/* eslint-disable react/prop-types */
function DesktopNavigation({ navigation, userNavigation, isAuthenticated, loginWithRedirect, logout }) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex h-16 items-center justify-between">
        <div className="flex items-center">
          <div className="shrink-0">
            <img alt="Your Company" src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500" className="size-8" />
          </div>
          <DesktopNavigationMenu navigation={navigation} />
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
          <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
            <span className="absolute -inset-0.5" />
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="block size-6 group-data-[open]:hidden" />
            <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-[open]:block" />
          </DisclosureButton>
        </div>
      </div>
    </div>
  )
}

/* eslint-disable react/prop-types */
function MobileNavigation({ navigation, userNavigation }) {
  return (
    <DisclosurePanel className="md:hidden">
      <MobileNavigationMenu navigation={navigation} />
      <div className="border-t border-gray-700 pb-3 pt-4">
        <div className="flex items-center px-5">
          <div className="shrink-0">
            <img alt="" src={user.imageUrl} className="size-10 rounded-full" />
          </div>
          <div className="ml-3">
            <div className="text-base/5 font-medium text-white">{user.name}</div>
            <div className="text-sm font-medium text-gray-400">{user.email}</div>
          </div>
          <button
            type="button"
            className="relative ml-auto shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            <span className="absolute -inset-1.5" />
            <span className="sr-only">View notifications</span>
            <BellIcon aria-hidden="true" className="size-6" />
          </button>
        </div>
        <MobileNavigationUserMenu userNavigation={userNavigation} />
      </div>
    </DisclosurePanel>
  )
}
