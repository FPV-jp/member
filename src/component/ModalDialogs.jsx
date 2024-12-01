'use client'

import { DialogTitle } from '@headlessui/react'
// import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import * as Components from '../component/Components'

/* eslint-disable react/prop-types */
export default function Example({ open, setOpen, Icon, title, message }) {
  return (
    <Components.ModalDialog open={open} onClose={setOpen}>
      <div className='bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4'>
        <div className='sm:flex sm:items-start'>
          <div className='mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10'>
            {/* <ExclamationTriangleIcon aria-hidden='true' className='size-6 text-red-600' /> */}
            <Icon aria-hidden='true' className='size-6 text-red-600' />
          </div>
          <div className='mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left'>
            <DialogTitle as='h3' className='text-base font-semibold text-gray-900'>
              {/* Deactivate account */}
              {title}
            </DialogTitle>
            <div className='mt-2'>
              <p className='text-sm text-gray-500'>
                {/* Are you sure you want to deactivate your account? All of your data will be permanently removed. This action cannot be undone. */}
                {message}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer setOpen={setOpen} />
    </Components.ModalDialog>
  )
}

function Footer({ setOpen }) {
  <div className='bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6'>
    <Components.ButtonDeactivate type='button' onClick={() => setOpen(false)}>
      Deactivate
    </Components.ButtonDeactivate>
    <Components.ButtonCancel2 type='button' data-autofocus onClick={() => setOpen(false)}>
      Cancel
    </Components.ButtonCancel2>
  </div>
}
