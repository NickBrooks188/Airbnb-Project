import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route, Outlet } from 'react-router-dom';
import LoginFormPage from './components/LoginFormPage/LoginFormPage.jsx'
import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import * as sessionActions from './store/session';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const dispatchLoaded = async () => {
      await dispatch(sessionActions.restoreUser())
      setIsLoaded(true)
    }
    dispatchLoaded()
  }, [dispatch]);

  return (
    <>
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter(createRoutesFromElements(
  <Route element={<Layout />}>
    <Route path='/' element={<h1> Hello from App </h1>} />
    <Route path='/login' element={<LoginFormPage />} />
  </Route>
))

function App() {
  return <RouterProvider router={router} />
}

export default App;
