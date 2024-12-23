import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { PhotoIcon, MusicalNoteIcon, FilmIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import * as Components from './Components'

/* eslint-disable react/prop-types */
export function Input({ label, htmlFor, ...props }) {
  return (
    <>
      <label htmlFor={htmlFor} className='block text-sm/6 font-medium text-gray-900'>
        {label}
      </label>
      <div className='mt-2'>
        <input id={htmlFor} name={htmlFor} type='text' className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6' {...props} />
      </div>
    </>
  )
}

/* eslint-disable react/prop-types */
export function Textarea({ label, htmlFor, ...props }) {
  return (
    <>
      <label htmlFor={htmlFor} className='block text-sm/6 font-medium text-gray-900'>
        {label}
      </label>
      <div className='mt-2'>
        <textarea id={htmlFor} name={htmlFor} className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6' {...props} />
      </div>
    </>
  )
}

/* eslint-disable react/prop-types */
export function CheckboxInput({ label, htmlFor, description, ...props }) {
  return (
    <div className='flex gap-3'>
      <div className='flex h-6 shrink-0 items-center'>
        <div className='group grid size-4 grid-cols-1'>
          <input id={htmlFor} name={htmlFor} type='checkbox' aria-describedby={`${htmlFor}-description`} className='col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto' {...props} />
          <svg fill='none' viewBox='0 0 14 14' className='pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25'>
            <path d='M3 8L6 11L11 3.5' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round' className='opacity-0 group-has-[:checked]:opacity-100' />
            <path d='M3 7H11' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round' className='opacity-0 group-has-[:indeterminate]:opacity-100' />
          </svg>
        </div>
      </div>
      <div className='text-sm/6'>
        <label htmlFor={htmlFor} className='font-medium text-gray-900'>
          {label}
        </label>
        <p id={`${htmlFor}-description`} className='text-gray-500'>
          {description}
        </p>
      </div>
    </div>
  )
}

/* eslint-disable react/prop-types */
export function RadioInput({ label, htmlFor, name, ...props }) {
  return (
    <div className='flex items-center gap-x-3'>
      <input id={htmlFor} name={name} type='radio' className='relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden [&:not(:checked)]:before:hidden' {...props} />
      <label htmlFor={htmlFor} className='block text-sm/6 font-medium text-gray-900'>
        {label}
      </label>
    </div>
  )
}

/* eslint-disable react/prop-types */
export function Select({ label, htmlFor, option, ...props }) {
  // const { defaultValue } = props
  return (
    <>
      <label htmlFor={htmlFor} className='block text-sm/6 font-medium text-gray-900'>
        {label}
      </label>
      <div className='mt-2 grid grid-cols-1'>
        <select id={htmlFor} name={htmlFor} className='col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6' {...props}>
          {option.map((op) => {
            return <option //selected={op == defaultValue} 
              key={op}>{op}</option>
          })}
        </select>
        <ChevronDownIcon aria-hidden='true' className='pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4' />
      </div>
    </>
  )
}

/* eslint-disable react/prop-types */
export function CustomTextInput({ label, htmlFor, ...props }) {
  return (
    <>
      <label htmlFor='username' className='block text-sm/6 font-medium text-gray-900'>
        {label}
      </label>
      <div className='mt-2'>
        <div className='flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600'>
          <div className='shrink-0 select-none text-base text-gray-500 sm:text-sm/6'>workcation.com/</div>
          <input id={htmlFor} name={htmlFor} type='text' className='block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6' {...props} />
        </div>
      </div>
    </>
  )
}

/* eslint-disable react/prop-types */
export function PhotoChange({ label, htmlFor, button, ...props }) {
  return (
    <>
      <label htmlFor={htmlFor} className='block text-sm/6 font-medium text-gray-900'>
        {label}
      </label>
      <div className='mt-2 flex items-center gap-x-3'>
        <UserCircleIcon aria-hidden='true' className='size-12 text-gray-300' />
        <Components.ButtonChange {...props}>{button}</Components.ButtonChange>
      </div>
    </>
  )
}

/* eslint-disable react/prop-types */
export function FileUpload({ label, htmlFor, ...props }) {
  const { name, formData, setFormData } = props
  function fileInputChange(event) {
    const { files } = event.target
    setFormData({ ...formData, [name]: [...(formData[name] || []), ...Array.from(files)] })
  }
  const handleDrop = (event) => {
    event.preventDefault()
    event.stopPropagation()
    const { files } = event.dataTransfer
    setFormData({ ...formData, [name]: [...(formData[name] || []), ...Array.from(files)] })
  }
  const handleDragOver = (event) => {
    event.preventDefault()
    event.stopPropagation()
  }
  return (
    <>
      <label htmlFor={htmlFor} className='block text-sm/6 font-medium text-gray-900'>
        {label}
      </label>
      <div className='mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10' onDrop={handleDrop} onDragOver={handleDragOver}>
        <div className='text-center'>
          <div className='flex justify-center space-x-4'>
            {formData[name] ? (
              <>
                {formData[name].map((file, index) => {
                  const type = file.type || ''
                  if (type.match('image.*'))
                    return (
                      <div key={index}>
                        <img alt={file.name} src={window.URL.createObjectURL(file)} className='aspect-square max-h-[200px] w-full max-w-[200px] rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]' />
                      </div>
                    )
                  if (type.match('video.*'))
                    return (
                      <div key={index}>
                        <FilmIcon aria-hidden='true' className='size-12 text-gray-300' />
                      </div>
                    )
                  if (type.match('audio.*'))
                    return (
                      <div key={index}>
                        <MusicalNoteIcon aria-hidden='true' className='size-12 text-gray-300' />
                      </div>
                    )
                })}
              </>
            ) : (
              <PhotoIcon aria-hidden='true' className='size-12 text-gray-300' />
            )}
          </div>

          <div className='mt-4 text-sm/6 text-gray-600'>
            <label htmlFor={name} className='inline-flex cursor-pointer items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'>
              <span>Select a file</span>
              <input id={name} name={name} type='file' multiple className='sr-only' onChange={fileInputChange} />
            </label>
            <p className='pl-1'>or drag and drop</p>
          </div>
          <p className='text-xs/5 text-gray-600'>PNG, JPG, GIF up to 10MB</p>
        </div>
      </div>
    </>
  )
}
