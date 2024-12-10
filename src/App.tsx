
import { RouterProvider, createRouter } from '@tanstack/react-router';
import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();
import { routeTree } from './routeTree.gen';
import React from 'react';
import { useAuth } from './hooks/useAuth';
const router = createRouter({
  routeTree,
  context: { queryClient },  // 将 queryClient 传递到上下文
});

function App() {
  const authentication = useAuth();
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} context={{ authentication, queryClient }} />
    </QueryClientProvider>
  )
}

export default App




