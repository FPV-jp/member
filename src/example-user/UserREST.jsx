import { useEffect, useState } from 'react'
import { useFetchQuery, useFetchMutation } from '../core'
import * as Components from '../component/Components'
import * as User from './User'

//--------------------------------------------------
// UserREST
//--------------------------------------------------
export default function ExampleUserREST() {
  const [updateForm, setUpdateForm] = useState({ open: false, user: null })

  function onUpdateHandle(user) {
    setUpdateForm({ open: true, user })
  }

  const deleteUser = useFetchMutation()
  const [notify, setNotify] = useState({ show: false, title: '', message: '' })

  async function onDeleteHandle(id) {
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
  // const { loading: isLoading, error: fetchError, data: userData } = useFetchQuery('/api/user/11', { method: 'GET' })

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
      <UpdateUserComponent {...{ updateForm, setUpdateForm, refetch, setNotify }} />
      <User.DisplayUsers users={data} {...{ onUpdateHandle, onDeleteHandle }} />
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
  const createUser = useFetchMutation()

  async function submit(event) {
    event.preventDefault()
    const body = JSON.stringify(formData)
    const response = await createUser('/api/createUser', { method: 'POST', body })
    if (response.ok) {
      refetch()
      setNotify({ show: true, title: 'ok', message: 'xxxxxx' })
    } else {
      const message = (await response.json()).error || 'API request failed'
      setNotify({ show: true, title: 'error', message: message })
    }
  }

  return <User.CreateUserForm {...{ formData, setFormData, submit }} />
}

//--------------------------------------------------
// UpdateUserComponent
//--------------------------------------------------
// * eslint-disable react/prop-types */
function UpdateUserComponent({ updateForm, setUpdateForm, refetch, setNotify }) {
  const [formData, setFormData] = useState({})
  const updateUser = useFetchMutation()

  async function submit(event) {
    event.preventDefault()
    try {
      const body = JSON.stringify(formData)
      const response = await updateUser('/api/updateUser', { method: 'POST', body })
      if (response.ok) {
        refetch()
        setUpdateForm((prevState) => ({ ...prevState, open: false }))
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
    if (updateForm.user && updateForm.open) {
      setFormData((prevState) => ({ ...prevState, ...updateForm.user }))
    }
  }, [updateForm])

  return <User.UpdateUserForm {...{ updateForm, setUpdateForm, formData, setFormData, submit }} />
}
