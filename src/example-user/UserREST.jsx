import { useEffect, useState } from 'react'
import { useFetchQuery, useFetchMutation } from '../core'
import * as Components from '../component/Components'
import * as User from './User'

//--------------------------------------------------
// UserREST
//--------------------------------------------------
export default function UserRESTExample() {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState()

  function onUpdateUser(user) {
    setUser(user)
    setOpen(true)
  }

  const deleteUser = useFetchMutation()
  const [notify, setNotify] = useState({ show: false, title: '', message: '' })

  async function onDeleteUser(id) {
    const body = JSON.stringify({ id })
    const response = await deleteUser('/api/deleteUser', { method: 'POST', body })
    if (response.ok) {
      refetch()
      setNotify({ show: true, title: 'ok', message: 'xxxxxx' })
    } else {
      const message = (await response.json()).error || 'API request failed'
      setNotify({ show: true, title: 'error', message: message })
    }
  }

  // eslint-disable-next-line no-unused-vars
  const { loading: isLoading, error: fetchError, data: userData } = useFetchQuery('/api/user/11', { method: 'GET' })

  const { loading, error, data, refetch } = useFetchQuery('/api/users', { method: 'GET' })
  if (loading) {
    return <Components.Loading />
  }
  if (error) {
    return <Components.Error message={error.message} />
  }

  return (
    <>
      <Components.Notify {...{ notify, setNotify }} />
      <CreateUserComponent {...{ refetch, setNotify }} />
      <UpdateUserComponent {...{ user, open, setOpen, refetch, setNotify }} />
      <User.DisplayUsers users={data} {...{ onUpdateUser, onDeleteUser }} />
    </>
  )
}

//--------------------------------------------------
// CreateUserComponent
//--------------------------------------------------

const initialFormValue = {
  email: 'example@example.com',
  password: 'z9hG4bK',
}

/* eslint-disable react/prop-types */
function CreateUserComponent({ refetch, setNotify }) {
  const [formData, setFormData] = useState({ ...initialFormValue })

  function inputChange(event) {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  const createUser = useFetchMutation()

  async function submit(event) {
    event.preventDefault()
    const body = JSON.stringify(formData)
    const response = await createUser('/api/createUser', { method: 'POST', body })
    if (response.ok) {
      // refetch()
      setNotify({ show: true, title: 'ok', message: 'xxxxxx' })
    } else {
      const message = (await response.json()).error || 'API request failed'
      setNotify({ show: true, title: 'error', message: message })
    }
  }

  return (
    <User.CreateUserForm {...{ formData, inputChange, submit }} />
  )
}

//--------------------------------------------------
// UpdateUserComponent
//--------------------------------------------------
// * eslint-disable react/prop-types */
function UpdateUserComponent({ user, open, setOpen, refetch, setNotify }) {
  const [formData, setFormData] = useState({})

  function inputChange(event) {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  const updateUser = useFetchMutation()
  const [updateUserError, setUpdateUserError] = useState()

  async function submit(event) {
    event.preventDefault()
    try {
      setUpdateUserError(null)
      const body = JSON.stringify(formData)
      const response = await updateUser('/api/updateUser', { method: 'POST', body })
      if (response.ok) {
        // refetch()
        setOpen(false)
        setNotify({ show: true, title: 'ok', message: 'xxxxxx' })
      } else {
        const message = (await response.json()).error || 'API request failed'
        setNotify({ show: true, title: 'error', message: message })
      }
    } catch (e) {
      setNotify({ show: true, title: 'error', message: e.message })
    }
  }

  useEffect(() => {
    if (user && open) {
      setFormData((prevFormData) => ({ ...prevFormData, ...user }))
    }
  }, [user, open])

  return (
    <>
      {updateUserError && <Components.Error message={updateUserError.message} />}
      <User.UpdateUserForm defaultValue={user} {...{ open, setOpen, inputChange, submit }} />
    </>
  )
}
