import * as Components from '../component/Components'
import * as FormComponents from '../component/FormComponents'

import { useEffect, useState } from 'react'

const initialFormValue = {
  about: 'xxxxx',
  emailComments: true,
  pushNotifications: 'push-everything',
}

export default function ExampleForm() {
  const [formData, setFormData] = useState({ ...initialFormValue })
  useEffect(() => {
    // setFormData((prevState) => ({ ...prevState, ...initialFormValue }))
    console.log('formData:', JSON.stringify(formData, null, 2))
  }, [formData])

  function inputChange(event) {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  function checkboxChange(event) {
    const { name, checked } = event.target
    setFormData({ ...formData, [name]: checked })
  }

  function radioChange(event) {
    const { name, id } = event.target
    setFormData({ ...formData, [name]: id })
  }

  async function submit(event) {
    event.preventDefault()
    console.log(formData)
  }

  return (
    <form onSubmit={submit}>
      <div className='space-y-12'>
        <div className='border-b border-gray-900/10 pb-12'>
          <h2 className='text-base/7 font-semibold text-gray-900'>Profile</h2>
          <p className='mt-1 text-sm/6 text-gray-600'>This information will be displayed publicly so be careful what you share.</p>

          <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
            <div className='sm:col-span-4'>
              <FormComponents.CustomTextInput label={'Username'} htmlFor={'username'} onChange={inputChange} placeholder='janesmith' />
            </div>

            <div className='col-span-full'>
              <FormComponents.Textarea label={'About'} htmlFor={'about'} rows={3} onChange={inputChange} defaultValue={formData.about} />
              <p className='mt-3 text-sm/6 text-gray-600'>Write a few sentences about yourself.</p>
            </div>

            <div className='col-span-full'>
              <FormComponents.PhotoChange label={'Photo'} htmlFor={'photo'} button={'Change'} />
            </div>

            <div className='col-span-full'>
              <FormComponents.FileUpload label={'Cover photo'} htmlFor={'cover-photo'} name={'uploadFiles'} formData={formData} setFormData={setFormData} />
            </div>
          </div>
        </div>

        <div className='border-b border-gray-900/10 pb-12'>
          <h2 className='text-base/7 font-semibold text-gray-900'>Personal Information</h2>
          <p className='mt-1 text-sm/6 text-gray-600'>Use a permanent address where you can receive mail.</p>

          <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
            <div className='sm:col-span-3'>
              <FormComponents.Input type='text' label={'First name'} htmlFor={'first-name'} onChange={inputChange} autoComplete={'given-name'} />
            </div>

            <div className='sm:col-span-3'>
              <FormComponents.Input type='text' label={'Last name'} htmlFor={'last-name'} onChange={inputChange} autoComplete={'family-name'} />
            </div>

            <div className='sm:col-span-4'>
              <FormComponents.Input type='text' label={'Email address'} htmlFor={'email'} onChange={inputChange} autoComplete={'email'} />
            </div>

            <div className='sm:col-span-3'>
              <FormComponents.Select label={'Country'} htmlFor={'country'} option={['United States', 'Canada', 'Mexico']} defaultValue={'Canada'} onChange={inputChange} autoComplete={'country-name'} />
            </div>

            <div className='col-span-full'>
              <FormComponents.Input type='text' label={'Street address'} htmlFor={'street-address'} onChange={inputChange} autoComplete={'street-address'} />
            </div>

            <div className='sm:col-span-2 sm:col-start-1'>
              <FormComponents.Input type='text' label={'City'} htmlFor={'city'} onChange={inputChange} autoComplete={'address-level2'} />
            </div>

            <div className='sm:col-span-2'>
              <FormComponents.Input type='text' label={'State / Province'} htmlFor={'region'} onChange={inputChange} autoComplete={'address-level1'} />
            </div>

            <div className='sm:col-span-2'>
              <FormComponents.Input type='text' label={'ZIP / Postal code'} htmlFor={'postal-code'} onChange={inputChange} autoComplete={'postal-code'} />
            </div>
          </div>
        </div>

        <div className='border-b border-gray-900/10 pb-12'>
          <h2 className='text-base/7 font-semibold text-gray-900'>Notifications</h2>
          <p className='mt-1 text-sm/6 text-gray-600'>{"We'll always let you know about important changes, but you pick what else you want to hear about."}</p>

          <div className='mt-10 space-y-10'>
            <fieldset>
              <legend className='text-sm/6 font-semibold text-gray-900'>By email</legend>
              <div className='mt-6 space-y-6'>
                <FormComponents.CheckboxInput label={'Comments'} htmlFor={'emailComments'} defaultChecked={initialFormValue.emailComments} onChange={checkboxChange} description={'Get notified when someones posts a comment on a posting.'} />
                <FormComponents.CheckboxInput label={'Candidates'} htmlFor={'emailCandidates'} defaultChecked={initialFormValue.emailCandidates} onChange={checkboxChange} description={'Get notified when a candidate applies for a job.'} />
                <FormComponents.CheckboxInput label={'Offers'} htmlFor={'emailOffers'} defaultChecked={initialFormValue.emailOffers} onChange={checkboxChange} description={'Get notified when a candidate accepts or rejects an offer.'} />
              </div>
            </fieldset>

            <fieldset>
              <legend className='text-sm/6 font-semibold text-gray-900'>Push notifications</legend>
              <p className='mt-1 text-sm/6 text-gray-600'>These are delivered via SMS to your mobile phone.</p>
              <div className='mt-6 space-y-6'>
                <FormComponents.RadioInput label={'Everything'} htmlFor={'push-everything'} defaultChecked={initialFormValue.pushNotifications == 'push-everything'} onChange={radioChange} name={'pushNotifications'} />
                <FormComponents.RadioInput label={'Same as email'} htmlFor={'push-email'} defaultChecked={initialFormValue.pushNotifications == 'push-email'} onChange={radioChange} name={'pushNotifications'} />
                <FormComponents.RadioInput label={'No push notifications'} htmlFor={'push-nothing'} defaultChecked={initialFormValue.pushNotifications == 'push-nothing'} onChange={radioChange} name={'pushNotifications'} />
              </div>
            </fieldset>
          </div>
        </div>
      </div>

      <div className='mt-6 flex items-center justify-end gap-x-6'>
        <Components.ButtonCancel>Cancel</Components.ButtonCancel>
        <Components.ButtonSave>Save</Components.ButtonSave>
      </div>
    </form>
  )
}
