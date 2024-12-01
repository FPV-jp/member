import { useEffect, useState, useRef, createContext, useContext } from 'react'
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react'
import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import { setContext } from '@apollo/client/link/context'
import { Loading } from './Components'

const URL = 'http://localhost:8000'

function isLocalhost() {
  return window.location.origin == 'http://localhost:5173'
}

const EnvContext = createContext()

/* eslint-disable react/prop-types */
export function EnvProvider({ children }) {
  const [env, setEnv] = useState(null)
  const api = '/api/env'
  useEffect(() => {
    fetch(isLocalhost() ? URL + api : api)
      .then((res) => res.json())
      .then((data) => { setEnv(data) })
      .catch((err) => console.error('Failed to load environment variables:', err))
  }, [])
  return <EnvContext.Provider value={env}>{env ? children : <Loading />}</EnvContext.Provider>
}

/* eslint-disable react-refresh/only-export-components */
export function useEnv() {
  return useContext(EnvContext)
}

/* eslint-disable react/prop-types */
export const Auth0ProviderWithRedirectCallback = ({ children }) => {
  const env = useEnv()
  const navigate = useNavigate()
  const onRedirectCallback = (appState) => {
    navigate((appState && appState.returnTo) || window.location.pathname)
  }
  return (
    <Auth0Provider
      onRedirectCallback={onRedirectCallback}
      domain={env.domain}
      clientId={env.clientId}
      authorizationParams={{
        audience: env.audience,
        scope: env.scope,
        redirect_uri: window.location.origin,
      }}
    >
      {children}
    </Auth0Provider>
  )
}

/* eslint-disable react/prop-types */
export const ApolloProviderWithToken = ({ children }) => {
  const env = useEnv()
  const { getAccessTokenSilently } = useAuth0()
  const authLink = setContext(async (_, { headers }) => {
    const accessToken = await getAccessTokenSilently({ authorizationParams: { audience: env.audience, scope: env.scope } })
    return { headers: { ...headers, authorization: `Bearer ${accessToken}` } }
  })
  const client = useRef()
  if (!client.current) {
    const uri = `${URL}/graphql`
    var httpLink = isLocalhost() ? new HttpLink({ uri }) : new HttpLink()
    client.current = new ApolloClient({ link: authLink.concat(httpLink), cache: new InMemoryCache() })
  }
  return <ApolloProvider client={client.current}>{children}</ApolloProvider>
}

/* eslint-disable react-refresh/only-export-components */
export const useApi = (api, options) => {
  const env = useEnv()
  const { getAccessTokenSilently } = useAuth0()
  const [state, setState] = useState({ data: null, error: null, loading: true })
  useEffect(() => {
    ; (async () => {
      try {
        const accessToken = await getAccessTokenSilently({ authorizationParams: { audience: env.audience, scope: env.scope } })
        const res = await fetch(isLocalhost() ? URL + api : api, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${accessToken}`,
          },
        })
        setState({ ...state, data: await res.json(), error: null, loading: false })
      } catch (error) {
        setState({ ...state, error, loading: false })
      }
    })()
  }, [env]) // eslint-disable-line react-hooks/exhaustive-deps
  return state
}
