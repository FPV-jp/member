import { Link } from 'react-router-dom'
import loading from '../assets/loading.svg'
import '../assets/loading.css'
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { useEffect } from 'react'

export const Loading = () => (
  <div className='spinner'>
    <img src={loading} alt='Loading...' />
  </div>
)

/* eslint-disable react/prop-types */
export function Error({ message }) {
  return (
    <div className='relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700' role='alert'>
      <strong className='font-bold'>Error: </strong>
      <pre className='block sm:inline'>{message}</pre>
    </div>
  )
}

export function ModalDialog({ children, ...props }) {
  return (
    <Dialog {...props} className='relative z-10'>
      <DialogBackdrop transition className='fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in' />
      <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
        <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
          <DialogPanel transition className='relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95'>
            {children}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}

/* eslint-disable react/prop-types */
export function Button({ children, ...props }) {
  return (
    <button type='button' className='inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50' {...props}>
      {children}
    </button>
  )
}

/* eslint-disable react/prop-types */
export function ButtonCancel({ children, ...props }) {
  return (
    <button type='button' className='text-sm/6 font-semibold text-gray-900' {...props}>
      {children}
    </button>
  )
}

/* eslint-disable react/prop-types */
export function ButtonChange({ children, ...props }) {
  return (
    <button type='button' className='rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50' {...props}>
      {children}
    </button>
  )
}

/* eslint-disable react/prop-types */
export function ButtonSave({ children, ...props }) {
  return (
    <button type='submit' className='rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600' {...props}>
      {children}
    </button>
  )
}

/* eslint-disable react/prop-types */
export function IndigoButton({ children, ...props }) {
  return (
    <button type='button' className='inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600' {...props}>
      {children}
    </button>
  )
}

/* eslint-disable react/prop-types */
export function ButtonDeactivate({ children, ...props }) {
  return (
    <button type='button' className='inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto' {...props}>
      {children}
    </button>
  )
}

/* eslint-disable react/prop-types */
export function ButtonCancel2({ children, ...props }) {
  return (
    <button type='button' className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto' {...props}>
      {children}
    </button>
  )
}

/* eslint-disable react/prop-types */
export function IconButton({ children, ...props }) {
  return (
    <button type='button' className='relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800' {...props}>
      {children}
    </button>
  )
}

/* eslint-disable react/prop-types */
export function MobileIconButton({ children, ...props }) {
  return (
    <button type='button' className='relative ml-auto shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800' {...props}>
      {children}
    </button>
  )
}

export function NotFound() {
  return (
    <main className='grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8'>
      <div className='text-center'>
        <p className='text-base font-semibold text-indigo-600'>404</p>
        <h1 className='mt-4 text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl'>Page not found</h1>
        <p className='mt-6 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8'>Sorry, we couldn’t find the page you’re looking for.</p>
        <div className='mt-10 flex items-center justify-center gap-x-6'>
          <Link to={'/'} className='rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
            Go back home
          </Link>
          <Link to={'/'} className='text-sm font-semibold text-gray-900'>
            Contact support <span aria-hidden='true'>&rarr;</span>
          </Link>
        </div>
      </div>
    </main>
  )
}

export function Notify({ notify, setNotify }) {
  useEffect(() => {
    if (notify.show) {
      const timer = setTimeout(() => setNotify({ ...notify, show: false }), 3000)
      return () => clearTimeout(timer)
    }
  }, [notify.show]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!notify.show) return null

  const isError = notify.title === 'error'
  const icon = isError ? (
    <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth='2' stroke='currentColor' className='h-5 w-5 text-red-500'>
      <path strokeLinecap='round' strokeLinejoin='round' d='M12 9v2m0 4h.01M4.93 4.93a10.002 10.002 0 0114.14 0M21 12a9.953 9.953 0 01-2.929 7.071M12 21a9.953 9.953 0 01-7.071-2.929M3 12a9.953 9.953 0 012.929-7.071' />
    </svg>
  ) : (
    <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth='2' stroke='currentColor' className='h-5 w-5 text-blue-500'>
      <path strokeLinecap='round' strokeLinejoin='round' d='M13 16h-1v-4h-1m1-4h.01M12 20.5c4.142 0 7.5-3.358 7.5-7.5S16.142 5.5 12 5.5 4.5 8.858 4.5 12s3.358 7.5 7.5 7.5z' />
    </svg>
  )

  return (
    <div className='fixed right-4 top-4 z-50'>
      <div className='mb-4 flex w-full max-w-sm items-center rounded-lg border border-gray-200 bg-white p-4 shadow-lg'>
        <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-500'>{icon}</div>
        <div className='ml-3'>
          <p className='text-sm font-medium text-gray-900'>{notify.title}</p>
          <p className='text-sm text-gray-500'>{notify.message}</p>
        </div>
        <button className='-mx-1.5 -my-1.5 ml-auto inline-flex h-8 w-8 rounded-lg bg-white p-1.5 text-gray-400 hover:text-gray-900 focus:ring-2 focus:ring-gray-200' onClick={() => setShowNotify(false)} aria-label='Close'>
          <span className='sr-only'>Close</span>
          <svg className='h-5 w-5' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
            <path fillRule='evenodd' d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z' clipRule='evenodd' />
          </svg>
        </button>
      </div>
    </div>
  )
}
