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
  </Route>
))

function App() {
  return <RouterProvider router={router} />
}

export default App
