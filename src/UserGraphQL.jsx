import { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { USERS_QUERY, CREATE_USER_MUTATION } from './gql/User'
import { Loading, Error } from './Components'

/* eslint-disable react/prop-types */
function CreateUserComponent({ refetch }) {
  const [createUser] = useMutation(CREATE_USER_MUTATION);
  const [error, setError] = useState()
  const handleCreateUser = async () => {
    try {
      const options = { variables: { user: { email: 'example@example.com', password: 'password123' } } }
      const response = await createUser(options)
      console.log('response:', JSON.stringify(response.data, null, 2));
      refetch()
    } catch (e) {
      setError(e)
    }
  }
  return (
    <>
      {error && <Error message={error.message} />}
      <button onClick={handleCreateUser}>Create User</button>
    </>
  )
}

export default function UserGraphQL() {
  const { loading, error, data, refetch } = useQuery(USERS_QUERY)
  if (loading) {
    return <Loading />
  }
  if (error) {
    return <Error message={error.message} />
  }
  return (
    <>
      <CreateUserComponent refetch={refetch} />
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Registered At</th>
            </tr>
          </thead>
          <tbody>
            {data?.users.map(({ id, email, registered_at }) => (
              <tr key={id} className="odd:bg-white even:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{id}</td>
                <td className="border border-gray-300 px-4 py-2">{email}</td>
                <td className="border border-gray-300 px-4 py-2">{registered_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
