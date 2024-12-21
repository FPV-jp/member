import { useEffect, useState, useRef, createContext, useCallback, useContext, useMemo } from 'react'
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react'
import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { Loading } from './component/Components'
import { jwtDecode } from 'jwt-decode'

const URL = 'http://localhost:8000'

const isLocalhost = () => window.location.hostname === 'localhost'

/* eslint-disable react-refresh/only-export-components */
export const endpoint = (api) => (isLocalhost() ? URL + api : api)

export const useProfile = () => {
  const env = useEnv()
  const { getIdTokenClaims, getAccessTokenSilently } = useAuth0()
  return async () => {
    const token = (await getIdTokenClaims()).__raw
    const decodedToken = jwtDecode(token)
    decodedToken.token = await getAccessTokenSilently({ authorizationParams: { audience: env.audience, scope: env.scope } })
    return decodedToken
  }
}

const fetchCall = async (api, options, env, getAccessTokenSilently) => {
  const accessToken = await getAccessTokenSilently({ authorizationParams: { audience: env.audience, scope: env.scope } })
  return await fetch(endpoint(api), {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  })
}

const EnvContext = createContext()

/* eslint-disable react-refresh/only-export-components */
export function useEnv() {
  return useContext(EnvContext)
}

/* eslint-disable react/prop-types */
export function EnvProvider({ children }) {
  const [env, setEnv] = useState(null)
  const api = '/api/env'
  useEffect(() => {
    fetch(endpoint(api))
      .then((res) => res.json())
      .then((data) => {
        setEnv(data)
      })
      .catch((err) => console.error('Failed to load environment variables:', err))
  }, [])
  return <EnvContext.Provider value={env}>{env ? children : <Loading />}</EnvContext.Provider>
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
  const errorLink = onError(({ networkError }) => {
    if (networkError && networkError.result && networkError.result.error) {
      networkError.message = networkError.result.error
    }
  })
  const client = useRef()
  if (!client.current) {
    const uri = `${URL}/graphql`
    var httpLink = isLocalhost() ? new HttpLink({ uri }) : new HttpLink()
    client.current = new ApolloClient({
      link: errorLink.concat(authLink.concat(httpLink)),
      cache: new InMemoryCache(),
    })
  }
  return <ApolloProvider client={client.current}>{children}</ApolloProvider>
}

const FetchContext = createContext()

/* eslint-disable react-refresh/only-export-components */
export const useFetchMutation = () => {
  return useContext(FetchContext)
}

/* eslint-disable react/prop-types */
export const FetchProvider = ({ children }) => {
  const env = useEnv()
  const { getAccessTokenSilently } = useAuth0()
  const fetchApi = async (api, options = {}) => {
    return await fetchCall(api, options, env, getAccessTokenSilently)
  }
  return <FetchContext.Provider value={fetchApi}>{children}</FetchContext.Provider>
}

/* eslint-disable react-refresh/only-export-components */
export const useFetchQuery = (api, options) => {
  const env = useEnv()
  const { getAccessTokenSilently } = useAuth0()
  const [state, setState] = useState({ data: null, error: null, loading: true })
  const refetch = useCallback(async () => {
    setState({ data: null, error: null, loading: true })
    try {
      const response = await fetchCall(api, options, env, getAccessTokenSilently)
      const data = await response.json()
      if (response.ok) {
        setState({ ...state, data, error: null, loading: false })
      } else {
        setState({ ...state, data: null, error: new Error(data.error || 'API request failed'), loading: false })
      }
    } catch (error) {
      setState({ ...state, error, loading: false })
    }
  }, [api, env, getAccessTokenSilently, options, state])
  useMemo(() => {
    refetch()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return { ...state, refetch }
}
