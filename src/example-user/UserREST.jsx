import { useEffect, useState } from 'react'
import { useFetchQuery, useFetchMutation } from '../core'
import * as Components from '../component/Components'
import * as User from './User'

//--------------------------------------------------
// UserREST
//--------------------------------------------------
export default function UserREST() {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState()

  function onUpdateUser(user) {
    setUser(user)
    setOpen(true)
  }

  const deleteUser = useFetchMutation()
  const [deleteUserError, setDeleteUserError] = useState()

  async function onDeleteUser(id) {
    setDeleteUserError(null)
    const body = JSON.stringify({ id })
    const response = await deleteUser('/api/deleteUser', { method: 'POST', body })
    if (response.ok) {
      refetch()
    } else {
      setDeleteUserError({ message: (await response.json()).error || 'API request failed' })
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
      {deleteUserError && <Components.Error message={deleteUserError.message} />}
      <CreateUserComponent {...{ refetch }} />
      <UpdateUserComponent {...{ user, open, setOpen, refetch }} />
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
function CreateUserComponent({ refetch }) {
  const [formData, setFormData] = useState({ ...initialFormValue })

  function inputChange(event) {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  const createUser = useFetchMutation()
  const [createUserError, setCreateUserError] = useState()

  async function submit(event) {
    event.preventDefault()
    setCreateUserError(null)
    const body = JSON.stringify(formData)
    const response = await createUser('/api/createUser', { method: 'POST', body })
    if (response.ok) {
      refetch()
    } else {
      setCreateUserError({ message: (await response.json()).error || 'API request failed' })
    }
  }

  return (
    <>
      {createUserError && <Components.Error message={createUserError.message} />}
      <User.CreateUserForm {...{ formData, inputChange, submit }} />
    </>
  )
}

//--------------------------------------------------
// UpdateUserComponent
//--------------------------------------------------
// * eslint-disable react/prop-types */
function UpdateUserComponent({ user, open, setOpen, refetch }) {
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
        refetch()
        setOpen(false)
      } else {
        setUpdateUserError({ message: (await response.json()).error || 'API request failed' })
      }
    } catch (e) {
      setUpdateUserError(e)
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
