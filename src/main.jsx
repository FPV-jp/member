import {createRoot} from 'react-dom/client'
import * as ReactRouter from 'react-router-dom'
import * as core from './core'
import Dashboard from './dashboard/Dashboard'
import './output.css'

const $ = (id) => document.getElementById(id)
const originalWarn = console.warn
console.warn = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('React Router Future Flag Warning')) return
  originalWarn(...args)
}

createRoot($('root')).render(
  <core.EnvProvider>
    <ReactRouter.BrowserRouter>
      <core.Auth0ProviderWithRedirectCallback>
        <core.FetchProvider>
          <core.ApolloProviderWithToken>
            <Dashboard />
          </core.ApolloProviderWithToken>
        </core.FetchProvider>
      </core.Auth0ProviderWithRedirectCallback>
    </ReactRouter.BrowserRouter>
  </core.EnvProvider>,
)
