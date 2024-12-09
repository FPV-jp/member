import { useApi } from './use-api'
import { Loading, Error } from './Components'
import FileUpload from './FileUpload'

export default function UserREST() {
  const { loading, error, data: users = [] } = useApi('/api/users', {})
  if (loading) {
    return <Loading />
  }
  if (error) {
    return <Error message={error.message} />
  }
  //   const { loadingx, errox, datax } = useApi('/api/createUser', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     password: 'password',
  //     email: 'john.doe@example.com',
  //   }),
  // })


  return (
    <>
      <FileUpload />
      <table className='table'>
        <thead>
          <tr>
            <th scope='col'>ID</th>
            <th scope='col'>Email</th>
            <th scope='col'>RegisteredAt</th>
          </tr>
        </thead>
        <tbody>
          {users.map(({ id, email, registered_at }, i) => (
            <tr key={i}>
              <td>{id}</td>
              <td>{email}</td>
              <td>{registered_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
