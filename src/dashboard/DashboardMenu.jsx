import { DisclosureButton, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Link } from 'react-router-dom'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

/* eslint-disable react/prop-types */
export function HamburgerButton({ children, ...props }) {
  return (
    <DisclosureButton className='group relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800' {...props}>
      {children}
    </DisclosureButton>
  )
}

/* eslint-disable react/prop-types */
export function DesktopNavigationMenu({ currentpath, navigation }) {
  return (
    <div className='hidden md:block'>
      <div className='ml-10 flex items-baseline space-x-4'>
        {navigation.map((item) => (
          <Link key={item.name} to={item.path} aria-current={currentpath === item.path ? 'page' : undefined} className={classNames(currentpath === item.path ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'rounded-md px-3 py-2 text-sm font-medium')}>
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  )
}

/* eslint-disable react/prop-types */
export function DesktopNavigationUserMenu({ user, userNavigation }) {
  return (
    <Menu as='div' className='relative ml-3'>
      <div>
        <MenuButton className='relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'>
          <span className='absolute -inset-1.5' />
          <span className='sr-only'>Open user menu</span>
          <img alt='' src={user.picture} className='size-8 rounded-full' />
        </MenuButton>
      </div>
      <MenuItems transition className='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in'>
        {userNavigation.map((item) => (
          <MenuItem key={item.name}>
            <Link key={item.name} to={item.path} onClick={item.onClick} className='block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none'>
              {item.name}
            </Link>
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  )
}

/* eslint-disable react/prop-types */
export function MobileNavigationMenu({ navigation }) {
  return (
    <div className='space-y-1 px-2 pb-3 pt-2 sm:px-3'>
      {navigation.map((item) => (
        <DisclosureButton key={item.name} as={Link} to={item.path} aria-current={item.current ? 'page' : undefined} className={classNames(item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'block rounded-md px-3 py-2 text-base font-medium')}>
          {item.name}
        </DisclosureButton>
      ))}
    </div>
  )
}

/* eslint-disable react/prop-types */
export function MobileNavigationUserMenu({ userNavigation }) {
  return (
    <div className='mt-3 space-y-1 px-2'>
      {userNavigation.map((item) => (
        <DisclosureButton key={item.name} as={Link} to={item.path} onClick={item.onClick} className='block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white'>
          {item.name}
        </DisclosureButton>
      ))}
    </div>
  )
}
