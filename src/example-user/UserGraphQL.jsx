import { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import * as schema from './schema'
import * as Components from '../component/Components'
import * as User from './User'

//--------------------------------------------------
// UserGraphQL
//--------------------------------------------------
export default function UserGraphQL() {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState()

  function onUpdateUser(user) {
    setUser(user)
    setOpen(true)
  }

  const [deleteUser] = useMutation(schema.DELETE_USER_MUTATION)
  const [deleteUserError, setDeleteUserError] = useState()

  async function onDeleteUser(id) {
    try {
      setDeleteUserError(null)
      const options = { variables: { id } }
      const response = await deleteUser(options)
      console.log('response:', JSON.stringify(response, null, 2))
      refetch()
    } catch (e) {
      setDeleteUserError(e)
    }
  }

  const options = { variables: { id: 11 } }
  // eslint-disable-next-line no-unused-vars
  const { loading: isLoading, error: fetchError, data: userData } = useQuery(schema.USER_QUERY, options)

  const { loading, error, data, refetch } = useQuery(schema.USERS_QUERY)
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
      <User.DisplayUsers users={data.users} {...{ onUpdateUser, onDeleteUser }} />
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

  const [createUser] = useMutation(schema.CREATE_USER_MUTATION)
  const [createUserError, setCreateUserError] = useState()

  async function submit(event) {
    event.preventDefault()
    try {
      setCreateUserError(null)
      const options = { variables: { user: { ...formData } } }
      const response = await createUser(options)
      console.log('response:', JSON.stringify(response, null, 2))
      refetch()
    } catch (e) {
      setCreateUserError(e)
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

  const [updateUser] = useMutation(schema.UPDATE_USER_MUTATION)
  const [updateUserError, setUpdateUserError] = useState()

  async function submit(event) {
    event.preventDefault()
    try {
      setUpdateUserError(null)
      const options = { variables: { user: { ...formData } } }
      const response = await updateUser(options)
      console.log('response:', JSON.stringify(response, null, 2))
      refetch()
      setOpen(false)
    } catch (e) {
      setUpdateUserError(e)
    }
  }

  useEffect(() => {
    if (user && open) {
      // eslint-disable-next-line no-unused-vars
      const { __typename, registered_at, ...filtered } = user
      setFormData((prevFormData) => ({ ...prevFormData, ...filtered }))
    }
  }, [user, open])

  return (
    <>
      {updateUserError && <Components.Error message={updateUserError.message} />}
      <User.UpdateUserForm defaultValue={user} {...{ open, setOpen, inputChange, submit }} />
    </>
  )
}
