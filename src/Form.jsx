import { TextInput, MultiTextInput, CheckboxInput, RadioInput, Select, CustomTextInput, PhotoChange, FileUpload } from './FormComponents'
import { useEffect, useState } from 'react'

const initialFormValue = {
  latitude: 0.0,
  longitude: 0.0,
  title: '',
  markerImage: null,
}

const option = ["United States", "Canada", "Mexico"]

export default function Form() {
  const [formData, setFormData] = useState({ ...initialFormValue })

  function inputChange(event) {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  function fileInputChange(event) {
    const { name, files } = event.target
    setFormData({ ...formData, [name]: files[0] })
  }

  async function submit(event) {
    event.preventDefault()
  }

  return (
    <form onSubmit={submit}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base/7 font-semibold text-gray-900">Profile</h2>
          <p className="mt-1 text-sm/6 text-gray-600">
            This information will be displayed publicly so be careful what you share.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <CustomTextInput />
            </div>

            <div className="col-span-full">
              <MultiTextInput label={"About"} htmlFor={"about"} />
              <p className="mt-3 text-sm/6 text-gray-600">Write a few sentences about yourself.</p>
            </div>

            <div className="col-span-full">
              <PhotoChange />
            </div>

            <div className="col-span-full">
              <FileUpload label={"Cover photo"} htmlFor={"cover-photo"} />
            </div>
          </div>
        </div>

        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base/7 font-semibold text-gray-900">Personal Information</h2>
          <p className="mt-1 text-sm/6 text-gray-600">Use a permanent address where you can receive mail.</p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <TextInput label={"First name"} htmlFor={"first-name"} autoComplete={"given-name"} />
            </div>

            <div className="sm:col-span-3">
              <TextInput label={"Last name"} htmlFor={"last-name"} autoComplete={"family-name"} />
            </div>

            <div className="sm:col-span-4">
              <TextInput label={"Email address"} htmlFor={"email"} autoComplete={"email"} />
            </div>

            <div className="sm:col-span-3">
              <Select label={"Country"} htmlFor={"country"} option={option} autoComplete={"country-name"} />
            </div>

            <div className="col-span-full">
              <TextInput label={"Street address"} htmlFor={"street-address"} autoComplete={"street-address"} />
            </div>

            <div className="sm:col-span-2 sm:col-start-1">
              <TextInput label={"City"} htmlFor={"city"} autoComplete={"address-level2"} />
            </div>

            <div className="sm:col-span-2">
              <TextInput label={"State / Province"} htmlFor={"region"} autoComplete={"address-level1"} />
            </div>

            <div className="sm:col-span-2">
              <TextInput label={"ZIP / Postal code"} htmlFor={"postal-code"} autoComplete={"postal-code"} />
            </div>
          </div>
        </div>

        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base/7 font-semibold text-gray-900">Notifications</h2>
          <p className="mt-1 text-sm/6 text-gray-600">
            {"We'll always let you know about important changes, but you pick what else you want to hear about."}
          </p>

          <div className="mt-10 space-y-10">
            <fieldset>
              <legend className="text-sm/6 font-semibold text-gray-900">By email</legend>
              <div className="mt-6 space-y-6">
                <CheckboxInput label={"Comments"} defaultChecked={true} htmlFor={"comments"} description={"Get notified when someones posts a comment on a posting."} />
                <CheckboxInput label={"Candidates"} defaultChecked={false} htmlFor={"candidates"} description={"Get notified when a candidate applies for a job."} />
                <CheckboxInput label={"Offers"} defaultChecked={false} htmlFor={"offers"} description={"Get notified when a candidate accepts or rejects an offer."} />
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-sm/6 font-semibold text-gray-900">Push notifications</legend>
              <p className="mt-1 text-sm/6 text-gray-600">These are delivered via SMS to your mobile phone.</p>
              <div className="mt-6 space-y-6">
                <RadioInput label={"Everything"} htmlFor={"push-everything"} name={"push-notifications"} />
                <RadioInput label={"Same as email"} htmlFor={"push-email"} name={"push-notifications"} />
                <RadioInput label={"No push notifications"} htmlFor={"push-nothing"} name={"push-notifications"} />
              </div>
            </fieldset>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" className="text-sm/6 font-semibold text-gray-900">
          Cancel
        </button>
        <button type="submit" className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          Save
        </button>
      </div>
    </form>
  )
}
