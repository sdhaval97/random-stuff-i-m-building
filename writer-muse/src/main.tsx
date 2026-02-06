import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from './components/Layout.tsx'
import './index.css'
import { NotesPage } from './pages/NotesPage.tsx'
import { TopicsPage } from './pages/TopicsPage.tsx'
import { WritingPage } from './pages/WritingPage.tsx'

// Placeholder for Topics page removed

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <NotesPage />,
      },
      {
        path: "topics",
        element: <TopicsPage />,
      },
      {
        path: "write/:topicId",
        element: <WritingPage />,
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
