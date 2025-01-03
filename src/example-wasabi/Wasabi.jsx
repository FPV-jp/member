import { useEffect, useState } from 'react'
import { useFetchQuery, useFetchMutation } from '../core'
import * as Components from '../component/Components'
import * as FormComponents from '../component/FormComponents'
import * as WasabiAction from './WasabiAction'

const fileSize = (size) => {
  return size > 1024 ? (size > 1048576 ? Math.round(size / 1048576) + 'MB' : Math.round(size / 1024) + 'KB') : size + 'Byte'
}

export default function ExampleWasabi() {
  const wasabi = useFetchMutation()
  const [wasabiError, setWasabiError] = useState()
  const [formData, setFormData] = useState({})
  const [objectURLs, setObjectURLs] = useState([])

  // Get file list
  const { loading, error, data } = useFetchQuery('/api/wasabi/list/user', { method: 'GET' })

  // Download file
  useEffect(() => {
    const fetchData = async () => {
      if (data)
        setObjectURLs(
          await WasabiAction.downloadToObjects(
            wasabi,
            setWasabiError,
            data.map((f) => f.Key),
          ),
        )
    }
    fetchData()
  }, [data]) // eslint-disable-line react-hooks/exhaustive-deps

  // Upload file
  async function submit(event) {
    event.preventDefault()
    if (formData.uploadfile.length < 1) return
    const response = await WasabiAction.uploadFiles(wasabi, setWasabiError, formData.uploadfile)
    if (response.ok) {
      setFormData({ ...formData, uploadfile: [] })
      const objectURLs2 = await WasabiAction.downloadToObjects(wasabi, setWasabiError, await response.json())
      setObjectURLs([...objectURLs, ...objectURLs2])
    }
  }

  if (loading) {
    return <Components.Loading />
  }
  if (error) {
    return <Components.Error message={error.message} />
  }

  return (
    <>
      {wasabiError && <Components.Error message={wasabiError.message} />}
      <form onSubmit={submit}>
        <FormComponents.FileUpload label={'Wasabi upload'} htmlFor={'uploadfile'} name={'uploadfile'} formData={formData} setFormData={setFormData} />
        <div className='mt-6 flex items-center justify-end gap-x-6'>
          <Components.ButtonSave>Upload</Components.ButtonSave>
        </div>
      </form>
      <div className='bg-white'>
        <div className='grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8'>
          {objectURLs.map((objectURL, i) => (
            <a key={i} href={objectURL.src} target='_blank' rel='noopener noreferrer' className='group'>
              <img alt={objectURL.alt} src={objectURL.src} className='aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]' />
              <p className='mt-3 text-lg font-medium text-gray-900'>{objectURL.name}</p>
              <h3 className='mt-1 text-sm text-gray-700'>{fileSize(objectURL.blob.size)}</h3>
            </a>
          ))}
        </div>
      </div>
    </>
  )
}
