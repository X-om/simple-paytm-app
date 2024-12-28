import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
import Signup from './pages/signup'
import Signin from './pages/Signin'
import Send from './pages/Send'
import Dashboard from './pages/dashboard'
import { RecoilRoot } from 'recoil'
import RouteGuard from './components/RouteGuard'

function App() {
  

  return (
    <RecoilRoot>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<RouteGuard><Dashboard/></RouteGuard>}></Route>
          <Route path='/signup' element={<Signup/>}></Route>
          <Route path='/signin' element={<Signin/>}></Route>
          <Route path='/send' element={<RouteGuard><Send/></RouteGuard>}></Route>
          <Route path='/dashboard' element={<RouteGuard><Dashboard/></RouteGuard>}></Route>
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  )
}

export default App
