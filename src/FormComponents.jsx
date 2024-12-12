import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'

/* eslint-disable react/prop-types */
export function TextInput({ label, htmlFor, ...props }) {
  console.log(props)
  const { autoComplete } = props
  return (
    <>
      <label htmlFor={htmlFor} className="block text-sm/6 font-medium text-gray-900">
        {label}
      </label>
      <div className="mt-2">
        <input
          id={htmlFor}
          name={htmlFor}
          type="text"
          autoComplete={autoComplete}
          // defaultValue={defaultValue}
          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
        />
      </div>
    </>
  )
}

/* eslint-disable react/prop-types */
export function MultiTextInput({ label, htmlFor, ...props }) {
  console.log(props)
  return (
    <>
      <label htmlFor={htmlFor} className="block text-sm/6 font-medium text-gray-900">
        {label}
      </label>
      <div className="mt-2">
        <textarea
          id={htmlFor}
          name={htmlFor}
          rows={3}
          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          defaultValue={''}
        />
      </div>
    </>
  )
}

/* eslint-disable react/prop-types */
export function CheckboxInput({ label, defaultChecked, htmlFor, description }) {
  return (
    <div className="flex gap-3">
      <div className="flex h-6 shrink-0 items-center">
        <div className="group grid size-4 grid-cols-1">
          <input
            defaultChecked={defaultChecked}
            id={htmlFor}
            name={htmlFor}
            type="checkbox"
            aria-describedby={`${htmlFor}-description`}
            className="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
          />
          <svg fill="none" viewBox="0 0 14 14" className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25" >
            <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="opacity-0 group-has-[:checked]:opacity-100" />
            <path d="M3 7H11" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="opacity-0 group-has-[:indeterminate]:opacity-100" />
          </svg>
        </div>
      </div>
      <div className="text-sm/6">
        <label htmlFor={htmlFor} className="font-medium text-gray-900">
          {label}
        </label>
        <p id={`${htmlFor}-description`} className="text-gray-500">
          {description}
        </p>
      </div>
    </div>
  )
}

/* eslint-disable react/prop-types */
export function RadioInput({ label, htmlFor, name }) {
  return (
    <div className="flex items-center gap-x-3">
      <input
        id={htmlFor}
        name={name}
        type="radio"
        className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden [&:not(:checked)]:before:hidden"
      />
      <label htmlFor={htmlFor} className="block text-sm/6 font-medium text-gray-900">
        {label}
      </label>
    </div>
  )
}

/* eslint-disable react/prop-types */
export function Select({ label, htmlFor, option, autoComplete }) {
  return (
    <>
      <label htmlFor={htmlFor} className="block text-sm/6 font-medium text-gray-900">
        {label}
      </label>
      <div className="mt-2 grid grid-cols-1">
        <select
          id={htmlFor}
          name={htmlFor}
          autoComplete={autoComplete}
          className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
        >
          {option.map((op) => { return <option key={op}>{op}</option> })}
        </select>
        <ChevronDownIcon
          aria-hidden="true"
          className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
        />
      </div>
    </>
  )
}

/* eslint-disable react/prop-types */
export function CustomTextInput({ ...props }) {
  console.log(props)
  return (
    <>
      <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
        Username
      </label>
      <div className="mt-2">
        <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
          <div className="shrink-0 select-none text-base text-gray-500 sm:text-sm/6">workcation.com/</div>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="janesmith"
            className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
          />
        </div>
      </div>
    </>
  )
}

/* eslint-disable react/prop-types */
export function PhotoChange({ ...props }) {
  console.log(props)
  return (
    <>
      <label htmlFor="photo" className="block text-sm/6 font-medium text-gray-900">
        Photo
      </label>
      <div className="mt-2 flex items-center gap-x-3">
        <UserCircleIcon aria-hidden="true" className="size-12 text-gray-300" />
        <button
          type="button"
          className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Change
        </button>
      </div>
    </>
  )
}

/* eslint-disable react/prop-types */
export function FileUpload({ label, htmlFor }) {
  return (
    <>
      <label htmlFor={htmlFor} className="block text-sm/6 font-medium text-gray-900">
        {label}
      </label>
      <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
        <div className="text-center">
          <PhotoIcon aria-hidden="true" className="mx-auto size-12 text-gray-300" />
          <div className="mt-4 flex text-sm/6 text-gray-600">
            <label htmlFor="file-upload"
              className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500" >
              <span>Upload a file</span>
              <input id="file-upload" name="file-upload" type="file" className="sr-only" />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs/5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
        </div>
      </div>
    </>
  )
}
