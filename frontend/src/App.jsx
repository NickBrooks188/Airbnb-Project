import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route, Outlet } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
import * as sessionActions from './store/session'
import Navigation from './components/Navigation/Navigation'


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
    <Route path='/' element={<h1> Spots </h1>} />
    <Route path='/spots' element={<Outlet />}>
      <Route path=':spotId' element={<h1>Spot placeholder</h1>} />
      <Route path='new' element={<h1>Spot form placeholder</h1>} />
      <Route path='current' element={<h1>User's spots placeholder</h1>} />
    </Route>
    <Route path='*' element={<h1>404: Page not found</h1>} />
  </Route>
))

function App() {
  return <RouterProvider router={router} />
}

export default App
