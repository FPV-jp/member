import { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import * as schema from './schema'
import * as Components from '../component/Components'
import * as User from './User'

//--------------------------------------------------
// UserGraphQL
//--------------------------------------------------
export default function UserGraphQLExample() {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState()

  function onUpdateUser(user) {
    setUser(user)
    setOpen(true)
  }

  const [deleteUser] = useMutation(schema.DELETE_USER_MUTATION)
  const [notify, setNotify] = useState({ show: false, title: '', message: '' })

  async function onDeleteUser(id) {
    try {
      const options = { variables: { id } }
      await deleteUser(options)
      refetch()
      setNotify({ show: true, title: 'ok', message: 'xxxxxx' })
    } catch (e) {
      setNotify({ show: true, title: 'error', message: e.message })
    }
  }

  // const options = { variables: { id: 11 } }
  // // eslint-disable-next-line no-unused-vars
  // const { loading: isLoading, error: fetchError, data: userData } = useQuery(schema.USER_QUERY, options)

  const { loading, error, data, refetch } = useQuery(schema.USERS_QUERY)
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
function CreateUserComponent({ refetch, setNotify }) {
  const [formData, setFormData] = useState({ ...initialFormValue })


  const [createUser] = useMutation(schema.CREATE_USER_MUTATION)

  async function submit(event) {
    event.preventDefault()
    try {
      const options = { variables: { user: { ...formData } } }
      await createUser(options)
      setNotify({ show: true, title: 'ok', message: 'xxxxxx' })
      refetch()
    } catch (e) {
      setNotify({ show: true, title: 'error', message: e.message })
    }
  }

  return (
    <User.CreateUserForm {...{ formData, setFormData, submit }} />
  )
}

//--------------------------------------------------
// UpdateUserComponent
//--------------------------------------------------
// * eslint-disable react/prop-types */
function UpdateUserComponent({ user, open, setOpen, refetch, setNotify }) {
  const [formData, setFormData] = useState({})

  const [updateUser] = useMutation(schema.UPDATE_USER_MUTATION)

  async function submit(event) {
    event.preventDefault()
    try {
      const options = { variables: { user: { ...formData } } }
      await updateUser(options)
      refetch()
      setOpen(false)
      setNotify({ show: true, title: 'ok', message: 'xxxxxx' })
    } catch (e) {
      setNotify({ show: true, title: 'error', message: e.message })
    }
  }

  useEffect(() => {
    if (user && open) {
      // eslint-disable-next-line no-unused-vars
      const { __typename, registered_at, ...filtered } = user
      setFormData((prevState) => ({ ...prevState, ...filtered }))
    }
  }, [user, open])

  return (
    <User.UpdateUserForm {...{ user, open, setOpen, formData, setFormData, submit }} />
  )
}
