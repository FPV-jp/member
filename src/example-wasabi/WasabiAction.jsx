import { endpoint } from '../core'

export const downloadToObject = async (wasabi, setWasabiError, api) => {
  setWasabiError(null)

  const response = await wasabi(api, { method: 'GET' })
  if (response.ok) {
    const blob = await response.blob()
    return {
      src: window.URL.createObjectURL(blob),
      alt: endpoint(api),
      blob: blob,
      name: api.split('/').pop(),
    }
  } else {
    setWasabiError({ message: 'API request failed' })
  }
}

export const downloadToObjects = async (wasabi, setWasabiError, apis) => {
  const objectURLs = []
  for (const api of apis) {
    objectURLs.push(await downloadToObject(wasabi, setWasabiError, api))
  }
  return objectURLs
}

export const uploadFiles = async (wasabi, setWasabiError, uploadfile) => {
  setWasabiError(null)

  const fileUpload = new FormData()
  for (const file of uploadfile) {
    fileUpload.append(file.name, file)
  }

  const response = await wasabi('/api/wasabi/upload/user', { method: 'POST', body: fileUpload })
  if (response.ok) {
    return response
  } else {
    setWasabiError({ message: (await response.json()).error || 'API request failed' })
  }
}
