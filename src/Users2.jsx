import { useApi } from './use-api'
import { Loading, Error } from './Components'

import { USERS_QUERY, CREATE_USER_MUTATION } from './User'
import { useMutation, useQuery } from '@apollo/client'

function DisplayUsers() {
  const { loading, error, data } = useQuery(USERS_QUERY)
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return data?.users.map(({ id, email, registered_at }) => (
    <div key={id}>
      <p>Email: {email}</p>
      <p>Registered At: {registered_at}</p>
    </div>
  ))
}

function CreateUserComponent() {
  const [createUser] = useMutation(CREATE_USER_MUTATION)
  const handleCreateUser = () => {
    const options = {
      variables: {
        user: {
          email: 'example@example.com',
          password: 'password123',
        },
      },
    }
    createUser(options)
      .then((response) => console.log('response:', response.data))
      .catch((error) => console.log('error:', error))
  }
  return <button onClick={handleCreateUser}>Create User</button>
}

export function Users2() {
  return (
    <>
      <CreateUserComponent />
      <DisplayUsers />
    </>
  )
}
