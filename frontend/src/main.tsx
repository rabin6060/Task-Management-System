import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {BrowserRouter} from 'react-router-dom'
import {UserProvider} from './Context/UserContext.tsx'
import { TaskProvider } from './Context/TaskContext.tsx'
import { ActiveProvider } from './Context/ActiveComponent.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserProvider>
      <TaskProvider>
        <ActiveProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
        </ActiveProvider>
      </TaskProvider>
    </UserProvider>
  </React.StrictMode>,
)

