import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import { Auth0ProviderWithRedirectCallback, ApolloProviderWithToken, EnvProvider } from './use-api'
import Dashboard from './Dashboard'
import './output.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <EnvProvider>
      <BrowserRouter>
        <Auth0ProviderWithRedirectCallback>
          <ApolloProviderWithToken>
            <Dashboard />
          </ApolloProviderWithToken>
        </Auth0ProviderWithRedirectCallback>
      </BrowserRouter>
    </EnvProvider>
  </React.StrictMode>,
)
