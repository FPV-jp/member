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
    <div>
      <img src='http://localhost:8000/api/wasabi/public/taifuu_top.png' />
      <input id='file-input' type='file' multiple onChange={fileInputChange} />
      <button type='button' onClick={() => WasabiUploadFiles()}>
        Upload
      </button>
      <ul>
        {files.map((file, index) => <li key={index}>{file.name}</li>)}
      </ul>
      <ul>
        {uploadedFiles.map((file, index) => <li key={index}><img src={file.src} alt={file.alt} /></li>)}
      </ul>
    </div>
  )
}

export default FileUpload
