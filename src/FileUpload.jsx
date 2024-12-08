import { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useEnv } from './use-api'

function isLocalhost() {
  return window.location.origin == 'http://localhost:5173'
}

const FileUpload = () => {
  const [files, setFiles] = useState([])
  const { getAccessTokenSilently } = useAuth0()
  const env = useEnv()

  const fileInputChange = (event) => {
    const selectedFiles = Array.from(event.target.files)
    //  const fileBlob = files[objectURL]
    //  if (fileBlob.type.match('video.*')) {
    //  if (fileBlob.type.match('image.*')) {
    //  if (fileBlob.type.match('audio.*')) {
    setFiles(selectedFiles)
  }

  const uploadFiles = async () => {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('file', file)
    })

    try {
      var url = '/api/wasabi/upload/user'
      const accessToken = await getAccessTokenSilently({
        authorizationParams: { audience: env.audience, scope: env.scope },
      })
      const response = await fetch(isLocalhost() ? 'http://localhost:8000' + url : url, {
        method: 'POST',
        body: formData,
        headers: { Authorization: `Bearer ${accessToken}` },
      })

      if (response.ok) {
        console.log('Files uploaded successfully')
      } else {
        console.error('Upload failed')
      }
    } catch (error) {
      console.error('Error uploading files:', error)
    }
  }

  return (
    <div>
      <input id='file-input' type='file' multiple onChange={fileInputChange} />
      <button type='button' onClick={() => document.getElementById('file-input').click()}>
        Choose Files
      </button>
      <button type='button' onClick={uploadFiles}>
        Upload
      </button>
      <ul>
        {files.map((file, index) => (
          <li key={index}>{file.name}</li>
        ))}
      </ul>
    </div>
  )
}

export default FileUpload
