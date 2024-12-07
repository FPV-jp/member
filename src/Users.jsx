import { useApi } from './use-api'
import { Loading, Error } from './Components'

export function Users() {
  const { loading, error, data: users = [] } = useApi('/api/users', {})
  // const { loadingx, errox, datax } = useApi('/api/createUser', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     password: 'password',
  //     email: 'john.doe@example.com',
  //   }),
  // })

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error.message} />
  }

return (
  <>
    {/* <CreateUserComponent /> */}
    <table className='table'>
      <thead>
        <tr>
          <th scope='col'>Name</th>
          <th scope='col'>Email</th>
        </tr>
      </thead>
      <tbody>
        {users.map(({ name, email }, i) => (
          <tr key={i}>
            <td>{name}</td>
            <td>{email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </>
)
}
