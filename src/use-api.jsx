import { useEffect, useState, useRef, createContext, useContext } from 'react'
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react'
import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import { setContext } from '@apollo/client/link/context'
import { Loading } from './Components'

const EnvContext = createContext()

function isLocalhost() {
  return window.location.origin == 'http://localhost:5173'
}

export function EnvProvider({ children }) {
  const [env, setEnv] = useState(null)
  const envApi = isLocalhost() ? 'http://localhost:8000/api/env' : '/api/env'
  useEffect(() => {
    fetch(envApi)
      .then((res) => res.json())
      .then((data) => {
        setEnv(data)
      })
      .catch((err) => {
        console.error('Failed to load environment variables:', err)
      })
  }, [])

  return <EnvContext.Provider value={env}>{env ? children : <Loading />}</EnvContext.Provider>
}

export function useEnv() {
  return useContext(EnvContext)
}

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

export const ApolloProviderWithToken = ({ children }) => {
  const env = useEnv()
  const { getAccessTokenSilently } = useAuth0()
  var httpLink = new HttpLink()
  if (isLocalhost()) {
    const uri = 'http://localhost:8000/graphql'
    httpLink = new HttpLink({ uri })
  }
  const authLink = setContext(async (_, { headers }) => {
    const accessToken = await getAccessTokenSilently({
      authorizationParams: { audience: env.audience, scope: env.scope },
    })
    // const response = await fetch('https://fpv.jp.auth0.com/userinfo', {
    //   method: 'GET',
    //   headers: {
    //     Authorization: `Bearer ${accessToken}`,
    //   },
    // });
    // const userInfo = await response.json();
    // console.log(userInfo);
    return { headers: { ...headers, authorization: `Bearer ${accessToken}` } }
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

export const useApi = (api, options) => {
  const env = useEnv()
  const url = isLocalhost() ? `http://localhost:8000${api}` : api
  const { getAccessTokenSilently } = useAuth0()
  const [state, setState] = useState({
    error: null,
    loading: true,
    data: null,
  })
  useEffect(() => {
    ;(async () => {
      try {
        const accessToken = await getAccessTokenSilently({
          authorizationParams: { audience: env.audience, scope: env.scope },
        })
        const res = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${accessToken}`,
          },
        })
        setState({
          ...state,
          data: await res.json(),
          error: null,
          loading: false,
        })
      } catch (error) {
        setState({ ...state, error, loading: false })
      }
    })()
  }, [env]) // eslint-disable-line react-hooks/exhaustive-deps
  return state
}
