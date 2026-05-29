import './App.scss'
import "./styles/button.scss"
import {router} from "./app.routes.jsx"
import { RouterProvider } from 'react-router'
import { AuthProvider } from './features/Auth/auth.context.jsx'
import { InterviewProvider } from './features/AI/Interview.context.jsx'

function App() {


  return (
    <AuthProvider>
      <InterviewProvider>
          <RouterProvider router={router}/>
      </InterviewProvider>
    
    </AuthProvider>
  )
}

export default App
