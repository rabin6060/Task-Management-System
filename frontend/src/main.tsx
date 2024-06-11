import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {BrowserRouter} from 'react-router-dom'
import {UserProvider} from './Context/UserContext.tsx'
import { TaskProvider } from './Context/TaskContext.tsx'
import { ActiveProvider } from './Context/ActiveComponent.tsx'
import { RefreshProvider } from './Context/RefreshPage.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserProvider>
      <TaskProvider>
        <ActiveProvider>
          <RefreshProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
        </RefreshProvider>
        </ActiveProvider>
      </TaskProvider>
    </UserProvider>
  </React.StrictMode>,
)

