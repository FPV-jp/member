import { DisclosureButton, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Route, Routes, useLocation, Link } from 'react-router-dom'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

/* eslint-disable react/prop-types */
export function Button({ children, ...props }) {
  return (
    <button type="button" className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" {...props}>
      {children}
    </button>
  )
}

/* eslint-disable react/prop-types */
export function IndigoButton({ children, ...props }) {
  return (
    <button type="button" className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" {...props}>
      {children}
    </button>
  )
}

/* eslint-disable react/prop-types */
export function IconButton({ children, ...props }) {
  return (
    <button type="button" className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" {...props}>
      {children}
    </button>
  )
}

/* eslint-disable react/prop-types */
export function MobileIconButton({ children, ...props }) {
  return (
    <button type="button" className="relative ml-auto shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" {...props}>
      {children}
    </button>
  )
}

/* eslint-disable react/prop-types */
export function DesktopNavigationMenu({ pathname, navigation }) {
  return (
    <div className="hidden md:block">
      <div className="ml-10 flex items-baseline space-x-4">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            aria-current={pathname === item.href ? 'page' : undefined}
            className={classNames(
              pathname === item.href ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'rounded-md px-3 py-2 text-sm font-medium',
            )}>
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  )
}

/* eslint-disable react/prop-types */
export function DesktopNavigationUserMenu({ user, userNavigation, logout }) {
  return (
    <Menu as="div" className="relative ml-3">
      <div>
        <MenuButton className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
          <span className="absolute -inset-1.5" />
          <span className="sr-only">Open user menu</span>
          <img alt="" src={user.picture} className="size-8 rounded-full" />
        </MenuButton>
      </div>
      <MenuItems transition className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in">
        {userNavigation.map((item) => (
          <MenuItem key={item.name}>
            <a href={item.href} onClick={logout} className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none">
              {item.name}
            </a>
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  )
}

/* eslint-disable react/prop-types */
export function MobileNavigationMenu({ navigation }) {
  return (
    <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
      {navigation.map((item) => (
        <DisclosureButton
          key={item.name}
          as="a"
          href={item.href}
          aria-current={item.current ? 'page' : undefined}
          className={classNames(
            item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
            'block rounded-md px-3 py-2 text-base font-medium',
          )}
        >
          {item.name}
        </DisclosureButton>
      ))}
    </div>
  )
}

/* eslint-disable react/prop-types */
export function MobileNavigationUserMenu({ userNavigation }) {
  return (
    <div className="mt-3 space-y-1 px-2">
      {userNavigation.map((item) => (
        <DisclosureButton
          key={item.name}
          as="a"
          href={item.href}
          className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
        >
          {item.name}
        </DisclosureButton>
      ))}
    </div>
  )
}

