import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react'
import { Route, Routes, useLocation, Link } from 'react-router-dom'
import './App.css'
import { Loading, Error } from './Components'
import { Users } from './Users'
import { Users2 } from './Users2'
import { useEffect } from 'react'

export function Nav() {
  const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0()
  const { pathname } = useLocation()

  useEffect(() => {
    console.log(user)
  }, [user])

  return (
    <nav className='navbar navbar-expand-lg navbar-light bg-light'>
      <span className='navbar-brand'>@auth0/auth0-react</span>
      <div className='collapse navbar-collapse'>
        <div className='navbar-nav'>
          <Link to='/' className={`nav-item nav-link${pathname === '/' ? ' active' : ''}`}>
            Home
          </Link>
          <Link to='/users' className={`nav-item nav-link${pathname === '/users' ? ' active' : ''}`}>
            Users
          </Link>
          <Link to='/users2' className={`nav-item nav-link${pathname === '/users2' ? ' active' : ''}`}>
            Users2
          </Link>
        </div>
      </div>

      {isAuthenticated ? (
        <div>
          <span id='hello'>Hello, {user?.name}!</span>
          <button className='btn btn-outline-secondary' id='logout' onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
            logout
          </button>
        </div>
      ) : (
        <button className='btn btn-outline-success' id='login' onClick={() => loginWithRedirect()}>
          login
        </button>
      )}
    </nav>
  )
}

const ProtectedUsers = withAuthenticationRequired(Users)
const ProtectedUsers2 = withAuthenticationRequired(Users2)

function App() {
  const { isLoading, error } = useAuth0()

  if (isLoading) {
    return <Loading />
  }

  return (
    <>
      <Nav />
      {error && <Error message={error.message} />}
      <Routes>
        <Route path='/' />
        <Route path='/users' element={<ProtectedUsers />} />
        <Route path='/users2' element={<ProtectedUsers2 />} />
      </Routes>
    </>
  )
}

export default App
