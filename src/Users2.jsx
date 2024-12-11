import { useMutation, useQuery } from '@apollo/client'
import { USERS_QUERY, CREATE_USER_MUTATION } from './gql/User'
import { Loading, Error } from './Components'

function DisplayUsers() {
  const { loading, error, data, refetch } = useQuery(USERS_QUERY)
  if (loading) {
    return <Loading />
  }
  if (error) {
    return <Error message={error.message} />
  }
  return data?.users.map(({ id, email, registered_at }, i) => (
    <tr key={i}>
      <td>{id}</td>
      <td>{email}</td>
      <td>{registered_at}</td>
    </tr>
  ))
}

function CreateUserComponent() {
  const [createUser] = useMutation(CREATE_USER_MUTATION);
  const handleCreateUser = async () => {
    try {
      const options = { variables: { user: { email: 'example@example.com', password: 'password123' } } }
      const response = await createUser(options)
      console.log('response:', response.data)
    } catch (error) {
      console.log('error:', error)
    }
  };
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
