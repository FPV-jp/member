import { DialogTitle } from '@headlessui/react'

import * as Components from '../component/Components'
import * as FormComponents from '../component/FormComponents'

/* eslint-disable react/prop-types */
export function DisplayUsers({ users, onUpdateUser, onDeleteUser }) {
  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full border-collapse border border-gray-300'>
        <thead>
          <tr className='bg-gray-100'>
            <th className='border border-gray-300 px-4 py-2 text-left'>ID</th>
            <th className='border border-gray-300 px-4 py-2 text-left'>Email</th>
            <th className='border border-gray-300 px-4 py-2 text-left'>RegisteredAt</th>
            <th className='border border-gray-300 px-4 py-2 text-left'>Update</th>
            <th className='border border-gray-300 px-4 py-2 text-left'>Delete</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user) => {
            const { id, email, registered_at } = user
            return (
              <tr key={id} className='odd:bg-white even:bg-gray-50'>
                <td className='border border-gray-300 px-4 py-2'>{id}</td>
                <td className='border border-gray-300 px-4 py-2'>{email}</td>
                <td className='border border-gray-300 px-4 py-2'>{registered_at}</td>
                <td className='border border-gray-300 px-4 py-2'>
                  <Components.ButtonChange onClick={() => onUpdateUser(user)}>Update</Components.ButtonChange>
                </td>
                <td className='border border-gray-300 px-4 py-2'>
                  <Components.ButtonChange onClick={() => onDeleteUser(id)}>Delete</Components.ButtonChange>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

/* eslint-disable react/prop-types */
export function CreateUserForm({ formData, inputChange, submit }) {
  return (
    <form onSubmit={submit}>
      <div className='space-y-12'>
        <div className='border-b border-gray-900/10 pb-12'>
          <h2 className='text-base/7 font-semibold text-gray-900'>Personal Information</h2>
          <p className='mt-1 text-sm/6 text-gray-600'>Use a permanent address where you can receive mail.</p>
          <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
            <div className='sm:col-span-4'>
              <FormComponents.Input type='text' label={'Email address'} htmlFor={'email'} onChange={inputChange} defaultValue={formData.email} autoComplete={'email'} />
            </div>
            <div className='sm:col-span-3'>
              <FormComponents.Input type='password' label={'Password'} htmlFor={'password'} onChange={inputChange} defaultValue={formData.password} autoComplete={'password'} />
            </div>
            <div className='sm:col-span-4'>
              <Components.ButtonSave>Save</Components.ButtonSave>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

/* eslint-disable react/prop-types */
export function UpdateUserForm({ open, setOpen, defaultValue, inputChange, submit }) {
  return (
    <Components.ModalDialog open={open} onClose={setOpen}>
      <form onSubmit={submit}>
        <div className='bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4'>
          <div className='sm:flex sm:items-start'>
            <div className='mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left'>
              <DialogTitle as='h3' className='text-base font-semibold text-gray-900'>
                Update user
              </DialogTitle>
              <div className='mt-2'>
                <FormComponents.Input type='text' label={'Email address'} htmlFor={'email'} onChange={inputChange} defaultValue={defaultValue?.email} autoComplete={'email'} />
              </div>
              <div className='mt-2'>
                <FormComponents.Input type='password' label={'Password'} htmlFor={'password'} onChange={inputChange} defaultValue={defaultValue?.password} autoComplete={'password'} />
              </div>
            </div>
          </div>
        </div>
        <div className='bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6'>
          <Components.ButtonDeactivate type='sumbit'>Update</Components.ButtonDeactivate>
          <Components.ButtonCancel2 type='button' data-autofocus onClick={() => setOpen(false)}>
            Cancel
          </Components.ButtonCancel2>
        </div>
      </form>
    </Components.ModalDialog>
  )
}
