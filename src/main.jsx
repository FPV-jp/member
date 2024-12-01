import ReactDOM from 'react-dom/client'
import * as ReactRouter from 'react-router-dom'
import * as core from './core'
import Dashboard from './dashboard/Dashboard'
import './output.css'

ReactDOM.createRoot(document.getElementById('root')).render(
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
