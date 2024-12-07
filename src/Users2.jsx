import { USERS_QUERY, CREATE_USER_MUTATION } from './gql/User'
import { useMutation, useQuery } from '@apollo/client'

function DisplayUsers() {
  const { loading, error, data } = useQuery(USERS_QUERY)
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  return data?.users.map(({ id, email, registered_at }, i) => (
    <tr key={i}>
      <td>{id}</td>
      <td>{name}</td>
      <td>{email}</td>
      <td>{registered_at}</td>
    </tr>
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
      <table className='table'>
        <thead>
          <tr>
            <th scope='col'>ID</th>
            <th scope='col'>Name</th>
            <th scope='col'>Email</th>
            <th scope='col'>RegisteredAt</th>
          </tr>
        </thead>
        <tbody>
          <DisplayUsers />
        </tbody>
      </table>
    </>
  )
}
