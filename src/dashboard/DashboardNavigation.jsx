import { DisclosurePanel } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { KeyIcon } from '@heroicons/react/20/solid'
import { Link } from 'react-router-dom'

import * as DashboardMenu from './DashboardMenu'
import * as Components from '../component/Components'

/* eslint-disable react/prop-types */
export function DesktopNavigation({ user, currentpath, navigation, userNavigation, isAuthenticated, loginWithRedirect, setNotificationOpen }) {
  return (
    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
      <div className='flex h-16 items-center justify-between'>
        <div className='flex items-center'>
          <div className='shrink-0'>
            <Link to={'/'}>
              <img alt='FPV Japan' src='https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500' className='size-8' />
            </Link>
          </div>
          <DashboardMenu.DesktopNavigationMenu {...{ currentpath, navigation }} />
        </div>
        <div className='hidden md:block'>
          {isAuthenticated ? (
            <div className='ml-4 flex items-center md:ml-6'>
              <Components.IconButton onClick={() => setNotificationOpen(true)}>
                <span className='absolute -inset-1.5' />
                <span className='sr-only'>View notifications</span>
                <BellIcon aria-hidden='true' className='size-6' />
              </Components.IconButton>
              {/* Profile dropdown */}
              <DashboardMenu.DesktopNavigationUserMenu {...{ user, userNavigation }} />
            </div>
          ) : (
            <div className='ml-4 flex items-center md:ml-6'>
              <Components.IndigoButton onClick={() => loginWithRedirect()}>
                <KeyIcon aria-hidden='true' className='-ml-0.5 mr-1.5 size-5' />
                Login
              </Components.IndigoButton>
            </div>
          )}
        </div>
        <div className='-mr-2 flex md:hidden'>
          {/* Mobile menu button */}
          {isAuthenticated ? (
            <DashboardMenu.HamburgerButton>
              <span className='absolute -inset-0.5' />
              <span className='sr-only'>Open main menu</span>
              <Bars3Icon aria-hidden='true' className='block size-6 group-data-[open]:hidden' />
              <XMarkIcon aria-hidden='true' className='hidden size-6 group-data-[open]:block' />
            </DashboardMenu.HamburgerButton>
          ) : (
            <Components.IndigoButton onClick={() => loginWithRedirect()}>
              <KeyIcon aria-hidden='true' className='-ml-0.5 mr-1.5 size-5' />
              Login
            </Components.IndigoButton>
          )}
        </div>
      </div>
    </div>
  )
}

/* eslint-disable react/prop-types */
export function MobileNavigation({ user, navigation, userNavigation, isAuthenticated, setNotificationOpen }) {
  return (
    <DisclosurePanel className='md:hidden'>
      <DashboardMenu.MobileNavigationMenu {...{ navigation }} />
      <div className='border-t border-gray-700 pb-3 pt-4'>
        {isAuthenticated && (
          <div className='flex items-center px-5'>
            <div className='shrink-0'>
              <img alt='' src={user.picture} className='size-10 rounded-full' />
            </div>
            <div className='ml-3'>
              <div className='text-base/5 font-medium text-white'>{user.name}</div>
              <div className='text-sm font-medium text-gray-400'>{user.email}</div>
            </div>
            <Components.MobileIconButton onClick={() => setNotificationOpen(true)}>
              <span className='absolute -inset-1.5' />
              <span className='sr-only'>View notifications</span>
              <BellIcon aria-hidden='true' className='size-6' />
            </Components.MobileIconButton>
          </div>
        )}
        <DashboardMenu.MobileNavigationUserMenu {...{ userNavigation }} />
      </div>
    </DisclosurePanel>
  )
}
