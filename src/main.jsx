import { StrictMode, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from './redux/store'

import PropTypes from 'prop-types'
import App from './App.jsx'
import './index.css'

const TOKEN_TYPE = 'id'

const ApolloProviderWithAuth0 = ({ children }) => {
  const { getAccessTokenSilently, getIdTokenClaims } = useAuth0()
  const httpLink = new HttpLink({uri: import.meta.env.VITE_GRAPHQL_ENDPOINT})
  const authLink = setContext(async (_, { headers, ...rest }) => {
    let token
    try {
      if (TOKEN_TYPE === 'id') token = (await getIdTokenClaims()).__raw
      if (TOKEN_TYPE === 'access') token = await getAccessTokenSilently()
    } catch (error) {
      console.log(error)
    }
    if (!token) return { headers, ...rest }
    return {...rest, headers: { ...headers, authorization: `Bearer ${token}`} }
  })
  const client = useRef()
  if (!client.current) {
    client.current = new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache(),
    })
  }
  return <ApolloProvider client={client.current}>{children}</ApolloProvider>
}

ApolloProviderWithAuth0.propTypes = {
  children: PropTypes.node.isRequired,
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <Auth0Provider
        domain={import.meta.env.VITE_DOMAIN}
        clientId={import.meta.env.VITE_CLIENT_ID}
        onRedirectCallback={(appState, user) => {
          console.log('appState:', appState)
          console.log('user:', user)
        }}
        authorizationParams={{
          audience: import.meta.env.VITE_AUDIENCE,
          redirect_uri: window.location.origin,
        }}
      >
        <ApolloProviderWithAuth0>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ApolloProviderWithAuth0>
      </Auth0Provider>
    </Provider>
  </StrictMode>,
)
