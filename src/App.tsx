
import { RouterProvider, createRouter } from '@tanstack/react-router';
import './App.css'
import { routeTree } from './routeTree.gen';
import React from 'react';
import { useAuth } from './hooks/useAuth';
const router = createRouter({
  routeTree,
  context: { authentication: undefined! },
});

function App() {
  const authentication = useAuth();
  return <RouterProvider router={router} context={{ authentication }} />;
}

export default App




