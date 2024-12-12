import { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useEnv } from './use-api'

const URL = 'http://localhost:8000'

function isLocalhost() {
  return window.location.origin == 'http://localhost:5173'
}

const FileUpload = () => {
  const env = useEnv()
  const { getAccessTokenSilently } = useAuth0()

  const [files, setFiles] = useState([])
  const [uploadedFiles, setUploadedFiles] = useState([])

  const WasabiFileToObjectURL = async (api) => {
    const accessToken = await getAccessTokenSilently({ authorizationParams: { audience: env.audience, scope: env.scope } })
    const response = await fetch(isLocalhost() ? URL + api : api, { headers: { Authorization: `Bearer ${accessToken}` } })
    if (!response.ok) { throw new Error('Failed to download file') }
    const blob = await response.blob()
    //  if (blob.type.match('video.*')) {
    //  if (blob.type.match('image.*')) {
    //  if (blob.type.match('audio.*')) {
    return {
      src: window.URL.createObjectURL(blob),
      alt: isLocalhost() ? URL + api : api,
      size: blob.size,
      type: blob.type,
      name: api.split('/').pop(),
    }
  }

  const WasabiFileToObjectURLs = async (response) => {
    const objectURLs = [];
    for (const url of await response.json()) {
      objectURLs.push(await WasabiFileToObjectURL(url))
    }
    console.log('objectURLs:', JSON.stringify(objectURLs, null, 2));
    return objectURLs
  }

  const WasabiUploadFiles = async () => {
    const formData = new FormData()
    files.forEach((file, i) => { formData.append('file' + i, file) })
    const api = '/api/wasabi/upload/user'
    const accessToken = await getAccessTokenSilently({ authorizationParams: { audience: env.audience, scope: env.scope } })
    const response = await fetch(isLocalhost() ? URL + api : api, { method: 'POST', body: formData, headers: { Authorization: `Bearer ${accessToken}` } })
    if (!response.ok) { throw new Error('Failed to upload file') }

    setUploadedFiles(await WasabiFileToObjectURLs(response))
  }

  const fileInputChange = (event) => {
    const selectedFiles = Array.from(event.target.files)
    setFiles(selectedFiles)
  }

  return (
    <>
      <img src='http://localhost:8000/api/wasabi/public/taifuu_top.png' />
      <input id='file-input' type='file' multiple onChange={fileInputChange} />
      <button type='button' onClick={() => WasabiUploadFiles()}>
        Upload
      </button>
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="sr-only">Wasabi</h2>
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {uploadedFiles.map((uploadedFile, i) => (
              <a key={i} href={uploadedFile.alt} className="group">
                <img
                  alt={uploadedFile.alt}
                  src={uploadedFile.src}
                  className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]"
                />
                <h3 className="mt-4 text-sm text-gray-700">{uploadedFile.name}</h3>
                <p className="mt-1 text-lg font-medium text-gray-900">{uploadedFile.size}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default FileUpload
