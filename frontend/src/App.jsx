import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route, Outlet } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
import * as sessionActions from './store/session'
import Navigation from './components/Navigation/Navigation'
import Home from './components/Home/Home'
import UserSpots from './components/UserSpots/UserSpots'
import SpotDetails from './components/SpotDetails/SpotDetails'
import SpotForm from './components/SpotForm/SpotForm'

function Layout() {
  const dispatch = useDispatch()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const dispatchLoaded = async () => {
      await dispatch(sessionActions.restoreUser())
      setIsLoaded(true)
    }
    dispatchLoaded()
  }, [dispatch])

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  )
}

const router = createBrowserRouter(createRoutesFromElements(
  <Route element={<Layout />}>
    <Route path='/' element={<Home />} />
    <Route path='/spots' element={<Outlet />}>
      <Route path=':spotId' element={<SpotDetails />} />
      <Route path=':spotId/edit' element={<SpotForm type={'edit'} />} />
      <Route path='new' element={<SpotForm type={'create'} />} />
      <Route path='current' element={<UserSpots />} />
    </Route>
    <Route path='*' element={<h1>404: Page not found</h1>} />
  </Route>
))

function App() {
  return <RouterProvider router={router} />
}

export default App
